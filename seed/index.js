const express = require('express');
const app=express();
const path=require('path')
const mongoose = require('mongoose')
const Campground = require('../models/campground')
const {descriptors,places} = require('./seedHelper')
const cities = require('./cities')

mongoose.set('strictQuery',true)

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    // useCreateIndex:true,
    // useNewUrlParse: true,
    useUnifiedTopology: true
}).then(d=>{
    console.log("Mongodb connection successful!!")
}).catch(err=>{
    console.log("Mongodb connection error")
    console.log(err)
})

const randomgen = (arr) => arr[Math.floor(Math.random()*arr.length)]

const seedData =async () =>{
    await Campground.deleteMany({})
    const random100 = Math.floor(Math.random()*1000)
    for(let i=0; i<100; i++){
        const camp = new Campground({
            location : `${cities[random100].city},${cities[random100].state}`,
            title : `${randomgen(descriptors)} ${randomgen(places)}`,
            price: random100,
            discription: `Now is the winter of our discontent
            Made glorious summer by this sun of York;
            And all the clouds that lourd upon our house
            In the deep bosom of the ocean buried.
            Now are our brows bound with victorious wreaths;
            Our bruised arms hung up for monuments;`,

            images: [
                {
                    url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ahfnenvca4tha00h2ubt.png',
                    filename: 'YelpCamp/ahfnenvca4tha00h2ubt'
                },
                {
                    url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ruyoaxgf72nzpi4y6cdi.png',
                    filename: 'YelpCamp/ruyoaxgf72nzpi4y6cdi'
                }
            ],
            author: '63de20606aa1734e23194d4d'


        })
        await camp.save();

    }
}

seedData().then(()=>{
    mongoose.connection.close();
});