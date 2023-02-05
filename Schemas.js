const Joi = require('joi')

module.exports.campgroundSchema = Joi.object({
    campground:Joi.object({
        title: Joi.string().required(),
        location : Joi.string().required(),
        discription : Joi.string().required(),
        price : Joi.number().required().min(0).max(1000000),
        images:Joi.array()
    }).required()
})



module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        body:Joi.string().required(),
        rating: Joi.number().min(0).max(5).required()
    }).required()
}).required();