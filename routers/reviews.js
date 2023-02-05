const express = require('express')
const router = express.Router({mergeParams:true}) // this is used to keep the parent params 
const catchAsync = require('../utils/catchAsync')
// const routerError= require('../utils/routerError')
const {reviewSchema} = require('../Schemas')
const Review = require('../models/reviews')
const Campground= require('../models/campground')
const session = require('express-session')
const {isLoggedIn, isReviewAuthor} =require('../middleware')



const validateReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body)
    if(error){
        const msg=error.details.map(el=>el.message).join(',')
        throw new routerError(msg,400)
    }
    else{
        next()
    }
}


router.post('/',validateReview,isLoggedIn,catchAsync(async (req,res,next)=>{
    const camp= await Campground.findById(req.params.id)
    const {review} = req.body
    const newreview = new Review(review)
    newreview.author=req.user._id;
    camp.reviews.push(newreview)
    await newreview.save();
    await camp.save();
    req.flash('success','New review added!')
    res.redirect(`/campgrounds/${camp._id}`)
    // res.send('review added')
}))


router.delete('/:reviewId',isLoggedIn,isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Review deleted successfully')
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;