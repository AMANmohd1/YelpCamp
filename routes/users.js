const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync')
const users = require('../controllers/users')

router.route('/register')
    .get(users.registerForm)    
    .post(catchAsync(users.postRegisterForm))

router.route('/login')
    .get(users.loginForm)
    .post(passport.authenticate('local',{ failureRedirect: '/login', failureMessage: true }),users.postLoginForm)

router.get('/logout',users.logoutRender)

module.exports = router;