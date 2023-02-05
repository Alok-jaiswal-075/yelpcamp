const mongoose = require('mongoose')
const User = require('./user')
const {Schema} = mongoose

const reviewsModel= new Schema({
    body:String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Review= mongoose.model('Review',reviewsModel)

module.exports = Review