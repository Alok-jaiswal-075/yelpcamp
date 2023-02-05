// const express= require('express')
// const router = express.Router()
// const passport = require('passport')
// const catchAsync = require('../utils/catchAsync')
// const User = require('../models/user')
// const session = require('express-session')
// const {isLoggedIn} = require('../middleware')

// router.get('/register',(req,res)=>{
//     res.render('users/register')
// })

// router.post('/register', async (req,res,next)=>{
//     try {
//         const {username,email,password} = req.body
//         const user = new User({username, email})
//         const registereduser = await User.register(user,password)
//         req.login(registereduser,err=>{            // to automatically login a person
//             if(err) return next(err)      // if there is any error then pass it to error handler
//             req.flash('success','Welcome to Yelpcamp')
//             res.redirect('/campgrounds')
//         })

//         }
//         catch(e){
//             req.flash('error',e.message);
//             res.redirect('/register')
//         }
// })

// router.get('/login',(req,res)=>{
//     res.render('users/login')
// })


// router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req,res)=>{ // this middleware automatically login and checks a user
//     req.flash('success','Logged in successfully')
//     const redirectUrl = req.session.returnTo || '/campgrounds';    // the url to which the user was trying to go is stored in redirectUrl and if there is no url in it, the default value is set to /campgrounds
//     // this is done through the middleware 
//     console.log(req.session.returnTo)
//     delete req.session.returnTo;    // after using the url delete it 
//     res.redirect(redirectUrl);
// })


// router.get('/logout', (req, res,next) => {
//     req.logout(function(err){                // logout is inbuilt function of passport and it requires a callback
//         if(err){ return next(err)}
//         req.flash('success', "Goodbye!");
//         res.redirect('/campgrounds');
//     })
// })

// module.exports = router;





const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get('/logout', (req, res,next) => {
    req.logout(function(err){                // logout is inbuilt function of passport and it requires a callback
        if(err){ return next(err)}
        req.flash('success', "Goodbye!");
        res.redirect('/campgrounds');
    })
})

module.exports = router;