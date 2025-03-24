const express = require('express');
const router = express.Router({mergeParams: true});

const Campground = require('../Models/campground');
const Review = require('../Models/review')
const catchAsync = require('../utils/catchAsync');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware.js')

module.exports.createReview = async (req, res) => {
    const id = (req.params.id);
    const campground = await Campground.findById(id);
    // console.log(campground);
    const review = await new Review(req.body.review);
    review.author = req.user;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review!')
    res.redirect(`/campgrounds/${id}`)
}
module.exports.deleteReview = async (req,res,next) => {
    const { id, reviewId } = req.params;
    const ca = await Campground.findByIdAndUpdate(id, { $pull:  { reviews: reviewId}})
    console.log(ca);

    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted the review!')
    res.redirect(`/campgrounds/${id}`)
}