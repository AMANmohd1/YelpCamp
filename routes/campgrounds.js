const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground')
const {isLoggedIn,isAuthor} = require('../middleware')
const campgrounds = require('../controllers/campgrounds')

const multer  = require('multer')
const {storage} = require('../cloudinary');
const upload = multer({ storage })

router.route('/')
    .get(campgrounds.index)
    .post(isLoggedIn,upload.array('campground[image]'),catchAsync(campgrounds.PostNewForm))
    

    
router.get('/new', isLoggedIn,campgrounds.newForm)

router.route('/:id')
    .get(campgrounds.showCampground)
    .put(isLoggedIn,isAuthor,campgrounds.updateCampground)
    .delete(isLoggedIn,isAuthor,campgrounds.deleteCampground)

router.get('/:id/edit',isLoggedIn,isAuthor ,catchAsync(campgrounds.renderEdit))

module.exports = router;

// const {campgroundSchema} = require('../schema.js');
