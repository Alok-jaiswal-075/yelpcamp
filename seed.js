const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Campground=require('./models/campground')

mongoose.set('strictQuery',true)

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    // useCreateIndex:true,
    // useNewUrlParse: true,
    useUnifiedTopology: true
}).then(d=>{
    console.log('Connection Successful')
}).catch(err=>{
    console.log('Error in connection')
    console.log(err)
});

const groundList = [
    {
        title:"Juhu",
        price:45,
        discription: "The best ground near a beach",
        location: "Mumbai"
    },
    {
        title:"Ladakh",
        price:58,
        discription: "Ground for camping in summers",
        location: "J&K"
    },
    {
        title: "Nilgiri",
        price:30,
        discription: "The best camping ground in lush green forests of Nilgiri",
        location: "Maharastra"
    }
]

Campground.insertMany(groundList).then(d=>{
    console.log(d);
}).catch(err=>{
    console.log("error in inserting values");
    console.log(err)
})