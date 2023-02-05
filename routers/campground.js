const express = require('express');
const app=express();
const path=require('path')
const mongoose = require('mongoose')
const Review = require('../models/reviews');
const Campground = require('../models/campground')
const methodOverride= require('method-override')
const { application } = require('express')
const engine=require('ejs-mate')
const catchAsync = require('../utils/catchAsync')
const AppError= require('../utils/AppError')
const {campgroundSchema,reviewSchema} = require('../Schemas')
const router = express.Router()
const session = require('express-session')
const flash = require('connect-flash')
const {isLoggedIn, isAuthor,validateCampground} = require('../middleware')
const campground = require('../controllers/campground')
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(campground.index))
    // .post(upload.single('image'),(req,res)=>{
    //     res.send(req.body,req.file);
    // })

    // .post(upload.array('image'),(req,res)=>{
    //     res.send(req.body,req.files);        //in array of files we use req.files instead of req.file
    // })

    .post(isLoggedIn, upload.array('image'),validateCampground, catchAsync(campground.newCampground))


router.get('/new',isLoggedIn,campground.getNewCampgroundForm)

router.route('/:id')
    .get(catchAsync(campground.oneCampground))
    .put(validateCampground,isLoggedIn,isAuthor,catchAsync(campground.updateOneCampground))
    .delete(isAuthor,isLoggedIn,catchAsync(campground.deleteOneCampground))

router.get('/edit/:id',isAuthor,isLoggedIn,catchAsync(campground.updateCampgroundForm))


module.exports = router;



