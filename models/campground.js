const { string } = require('joi');
const mongoose= require('mongoose')
const Review= require('./reviews')
const User = require('./user')
const Schema = mongoose.Schema

const CampgroundSchema = new Schema({
    title: String,
    price : Number,
    discription: String,
    location: String,
    images:[
    {    url:String,
        filename:String}
    ],
    author : {
        type: mongoose.Types.ObjectId,
        ref:'User'
    },
    reviews:[
        {
            type:mongoose.Types.ObjectId,
            ref:'Review'
        }
    ]
});


CampgroundSchema.post('findOneAndDelete',async (camp)=>{
    
    if(camp){
        const reviews = camp.reviews;
        while(reviews.length){
            await Review.deleteMany({_id : {$in: reviews}})
        }
    }
})

const Campground = mongoose.model('Campground',CampgroundSchema)

module.exports= Campground