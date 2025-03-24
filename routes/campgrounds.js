const express = require('express');
const router = express.Router();
const Campground = require('../Models/campground');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware.js');
const campgrounds = require('../controllers/campgrounds.js')
const multer  = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage })


router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,  upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))
    // .post(upload.array('image'), (req,res) => {})

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put( isLoggedIn, upload.array('image'), validateCampground,isAuthor, catchAsync(campgrounds.editCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

// router.get('/', catchAsync(campgrounds.index))
// router.get('/:id', catchAsync(campgrounds.showCampground))

// router.post('/', validateCampground, isLoggedIn, catchAsync(campgrounds.createCampground))


// router.put('/:id', validateCampground, isLoggedIn, isAuthor, catchAsync(campgrounds.editCampground))

// router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

module.exports = router;