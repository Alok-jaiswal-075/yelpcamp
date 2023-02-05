if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}


const express = require('express');
const app=express();
const path=require('path')
const mongoose = require('mongoose')
const Review = require('./models/reviews');
const methodOverride= require('method-override')
const { application } = require('express')
const engine=require('ejs-mate')
const catchAsync = require('./utils/catchAsync')
const AppError= require('./utils/AppError')
const session = require('express-session')
const flash = require('connect-flash')
const {campgroundSchema,reviewSchema} = require('./Schemas')
const User = require('./models/user')
const {isLoggedIn} = require('./middleware') 

const MongoStore = require('connect-mongo');   //required to store session in remote dbs

// this both packages works along with passport package
const passport = require('passport')
const localStrategy = require('passport-local')


const campgrounds= require('./routers/campground')
const reviews = require('./routers/reviews');
const user=require('./routers/users')
const { getMaxListeners } = require('process');

app.engine('ejs',engine)     //to use ejs-mate for boiler-plates

mongoose.set('strictQuery',true)

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp'
// const dbUrl =  'mongodb://localhost:27017/yelp-camp'

// mongoose.connect(dbUrl,{
//     // useCreateIndex:true,
//     // useNewUrlParse: true,
//     useUnifiedTopology: true
// }).then(d=>{
//     console.log("Mongodb connection successful!!")
// }).catch(err=>{
//     console.log("Mongodb connection error")
//     console.log(err)
// })

const port = process.env.PORT || 3000;

const connectDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.DB_URL);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }

// app.listen(port,()=>{
//     console.log("App is listening")
// })


const store = MongoStore.create({
    mongoUrl: 'mongodb://localhost/test-app',
    touchAfter: 24 * 3600 ,// time period in seconds
    crypto: {
        secret: 'squirrel'
      }
  })

store.on('error',function(e){
    console.log('session store error',e )
})

const sessionConfig = {
    store,
    secret: 'thisismysecret',
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        expires: Date.now() + 1000* 60 * 60 * 24 * 7,    // date is in millisecond so adding 7 days to it
        maxAge: 1000* 60 * 60 * 24 * 7
    }
}

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(session(sessionConfig))
app.use(flash())

// setting up passport  for express 
app.use(passport.initialize())
app.use(passport.session())                        // passport.session must be used after session
passport.use(new localStrategy(User.authenticate()))     //User model should be passed here for authentication
passport.serializeUser(User.serializeUser())      // tells how to store a User in session
passport.deserializeUser(User.deserializeUser()) // tells how to remove a user from a session



app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(express.static(path.join(__dirname,'public')))


app.use((req, res, next) => {
    // console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/',(req,res)=>{
    res.render('campgrounds/home')
})
app.use('/',user)
app.use('/campgrounds',campgrounds)
app.use('/campgrounds/:id/reviews',reviews)     // here we are also sending params to the router . Express divide params when this is sent so we need to tell the router to enable mergeParams property which is done in reviews file



// app.get('/register', async (req,res)=>{
//     const user = new User({email: 'alok@gmail.com', username: "alokkkk"})
//     const newUser = await User.register(user,'mypassword')  // this will register a new user with its password and hash it, it also checks if a user is unique or not
//     res.send(newUser)
// })


app.use('*',(req,res,next)=>{
    next(new AppError('Page Not Found',404))
})

app.use((err,req,res,next)=>{
    const {message="Something went wrong",status=500} = err;
    res.status(status).render('campgrounds/error',{err});
})


connectDB().then(() => {
    app.listen(port, () => {
        console.log("listening for requests");
    })
})