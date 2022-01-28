const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');


const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    // console.log(req.session)
    if(!['/login','/','/register'].includes(req.originalUrl)){
        req.session.returnTo = req.originalUrl;
    }
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)


app.get('/', (req, res) => {
    res.render('home')
});


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})

// const express = require('express');
// const app = express();
// const path = require('path');
// const mongoose = require('mongoose');
// const methodOverride = require('method-override');
// const ejsMate = require('ejs-mate');
// const ExpressError = require('./utils/ExpressError');
// const session = require('express-session');
// const flash = require('connect-flash');
// const passport = require('passport');
// const LocalStrategy = require('passport-local');
// const User = require('./models/user')

// const campgroundRoutes = require('./routes/campgrounds');
// const reviewRoutes = require('./routes/reviews');
// const userRoutes = require('./routes/users');


// mongoose.connect('mongodb://localhost:27017/yelp-camp');

// const db = mongoose.connection;

// db.on("error", console.error.bind(console,"connection error"));
// db.once("open", ()=>{
//     console.log("Database Connected");
// })

// app.engine('ejs',ejsMate);
// app.set('view engine','ejs');
// app.set('views',path.join(__dirname,'views'))
// app.use(express.static(path.join(__dirname,'public')));

// app.use(express.urlencoded({extended:true}));
// app.use(methodOverride('_method'));
// app.use(passport.initialize())
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));



// const sessionConfig = {
//     secret: 'secretPOG',
//     resave: false,
//     saveUninitialized : true,
//     cookie:{
//         httpOnly: true,
//         expires: Date.now() + 1000*60*60*24*7,
//         maxAge: 1000*60*60*24*7
//     }
// }
// app.use(session(sessionConfig));
// app.use(flash());

// app.use((req, res, next) => {
//     // console.log(req.session)
//     res.locals.currentUser = req.user;
//     res.locals.success = req.flash('success');
//     res.locals.error = req.flash('error');
//     next();
// })

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// // app.use((req,res,next) =>{
// //     res.locals.currentUser = req.user;
// //     res.locals.success = req.flash('success');
// //     res.locals.error = req.flash('error');
// //     next();
// // })



// // app.get('/')

// app.use('/campgrounds',campgroundRoutes)
// app.use('/campgrounds/:id/reviews',reviewRoutes)
// app.use('/',userRoutes)


// app.get('/',(req,res)=>{
//     res.render('home');
// })


// app.all('*',(req,res,next) =>{
//     next(new ExpressError('Page not found',404))
// })

// app.use((err,req,res,next) =>{
//     const {statusCode = 500} = err;
//     if(!err.message) err.message = 'Oh NO Something went wrong.'
//     res.status(statusCode).render('error',{err})
// })



// app.listen(3000,()=>{
//     console.log("LISTENING ON PORT 3000 !!");
// })

// const validateCampground = (req,res,next) =>{
    
//     const {error} = campgroundSchema.validate(req.body);
//     if(error){
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg,400);
//     }else{
//         next();
//     }
// }