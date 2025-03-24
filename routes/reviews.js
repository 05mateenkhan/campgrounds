const express = require('express');
const router = express.Router({mergeParams: true});

const Campground = require('../Models/campground');
const Review = require('../Models/review')
const catchAsync = require('../utils/catchAsync');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware.js')
const reviews = require('../controllers/reviews.js')


router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, (reviews.deleteReview))

module.exports = router;