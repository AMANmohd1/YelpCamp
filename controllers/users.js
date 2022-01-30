const User = require('../models/user');


module.exports.registerForm = (req,res)=>{
    res.render('users/register')
}

module.exports.postRegisterForm = async(req,res,next) =>{
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
    
}

module.exports.loginForm = (req,res) =>{
    res.render('users/login');
}

module.exports.postLoginForm = (req,res) =>{
    req.flash('success','Welcome Back');
    res.redirect('/campgrounds');
}

module.exports.logoutRender = (req,res)=>{
    req.logout();
    req.flash('success','Logged Out')
    res.redirect('/campgrounds');
}