const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground')
const {isLoggedIn,isAuthor} = require('../middleware')


router.get('/', async (req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds})
})

// <---------------------CAMPGROUND WITH ID ROUTES--------------------->

router.get('/:id',async (req,res) =>{
    const campground = await Campground.findById(req.params.id).populate({path: 'reviews',populate:{path:'author'}}).populate('author');
    if(!campground){
        req.flash('error','Campground doesnt exist.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show',{campground});
})

router.get('/:id/edit',isLoggedIn,isAuthor ,catchAsync(async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error','Campground doesnt exist.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit',{campground});
}))

router.put('/:id', isLoggedIn,isAuthor,async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    req.flash('success','Successfully updated Campground')
    res.redirect(`/campgrounds/${campground._id}`);
})

// <---------------------CAMPGROUND WITH ID ROUTES END--------------------->

// <---------------------NEW CAMPGROUNDS ROUTES--------------------->

router.get('/new', isLoggedIn,(req,res) =>{
    res.render('campgrounds/new');
})

router.post('/',isLoggedIn,catchAsync(async(req,res,next) =>{
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data',400);
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success','Successfully created new Campground')
    res.redirect(`/campgrounds/${campground._id}`);
}))

// <---------------------NEW CAMPGROUNDS ROUTES END--------------------->

// <---------------------DELETE ROUTE--------------------->

router.delete('/:id',isLoggedIn,isAuthor,async(req,res) =>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error','You do not have Permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})

// <---------------------DELETE ROUTE END--------------------->


module.exports = router;

// const {campgroundSchema} = require('../schema.js');
