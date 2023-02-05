const Campground = require("./models/campground");
const Review = require('./models/reviews')
const {campgroundSchema} = require('./Schemas')
const AppError= require('./utils/AppError')

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}


module.exports.isAuthor =async (req,res,next) =>{
    const {id} = req.params
    const camp =await Campground.findById(id)
    if(!(req.user && camp.author.equals(req.user._id))){
        req.flash('error','Permission denied!!')
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

module.exports.isReviewAuthor =async (req,res,next) =>{
    const {id,reviewId} = req.params
    const review =await Review.findById(reviewId)
    if(!(req.user && review.author.equals(req.user._id))){
        req.flash('error','Permission denied!!')
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

module.exports.validateCampground = (req,res,next) =>{
    const {error} = campgroundSchema.validate(req.body)       //here error should be with name error only 
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new AppError(msg,400)
    }
    else{
        next()
    }
}