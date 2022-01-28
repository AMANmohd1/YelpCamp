module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash('error','You must be signed In');
        return res.redirect('/login');
    }
    next();
}



