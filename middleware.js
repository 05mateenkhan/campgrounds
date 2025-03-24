const ExpressError = require('./utils/ExpressError')
const Campground = require('./Models/campground')
const Review = require('./Models/review.js')
const { campgroundSchema, reviewSchema }= require('./schemas.js')

module.exports.isLoggedIn = (req, res, next) => {
    // console.log('Req.user...', req.user);
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'must be logged in');
        return res.redirect('/login');
    }
    else{
        next();
    }  
}
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {

    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const message = error.details.map(el => el.message).join(',')
        throw new ExpressError(message, 400)
    }
    else {
        next();
    }
}
module.exports.isAuthor = async(req,res,next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user.id)) {
        req.flash('error', 'you dont have permession')
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}
module.exports.isReviewAuthor = async(req,res,next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user.id)) {
        req.flash('error', 'you dont have permession')
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

module.exports.validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error) {
        const message = error.details.map(el => el.message).join(',')
        throw new ExpressError(message, 400)
    }
    else {
        next();
    }
}