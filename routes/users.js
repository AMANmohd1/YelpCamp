const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync')

router.get('/register',(req,res)=>{
    res.render('users/register')
})

router.post('/register',catchAsync(async(req,res,next) =>{
    try{
        const {email,username,password} = req.body;
        const user = new User({email,username});
        const registeredUser = await User.register(user,password);
        req.login(registeredUser,err=>{
            if(err) return next(err);
            req.flash('success','Welcome to Yelp-Camp');
            const redirectUrl = req.session.returnTo || '/campgrounds';
            delete req.session.returnTo;
            res.redirect(redirectUrl);
        })
    }catch(e){
        req.flash('error',e.message);
        res.redirect('register')
    }
    
    // console.log(registeredUser)
    
}))

router.get('/login',(req,res) =>{
    res.render('users/login');
})

router.post('/login',passport.authenticate('local',{ failureRedirect: '/login', failureMessage: true }),(req,res) =>{
    req.flash('success','Welcome Back');
    res.redirect('/campgrounds');
})

router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success','Logged Out')
    res.redirect('/campgrounds');
})

module.exports = router;