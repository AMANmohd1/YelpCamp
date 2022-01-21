const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground')
const {campgroundSchema} = require('../schema.js');

router.get('/', async (req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds})
})

router.get('/new', (req,res) =>{
    res.render('campgrounds/new');
})

router.post('/',catchAsync(async(req,res,next) =>{
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data',400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success','Successfully created new Campground')
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.get('/:id/edit', catchAsync(async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit',{campground});
}))

router.put('/:id', async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    req.flash('success','Successfully updated Campground')
    res.redirect(`/campgrounds/${campground._id}`);
})

router.get('/:id',async (req,res) =>{
    const campground = await Campground.findById(req.params.id).populate('reviews');
    if(!campground){
        req.flash('error','Campground doesnt exist.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show',{campground});
})

router.delete('/:id',async(req,res) =>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})

module.exports = router;