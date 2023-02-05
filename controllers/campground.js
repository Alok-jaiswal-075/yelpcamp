const Campground = require('../models/campground')

module.exports.index= async (req,res,next)=>{
    const camps=await Campground.find({});
    res.render('campgrounds/index',{camps})
    // console.log(camps)
    // res.send('home page')
}


module.exports.newCampground=async (req,res,next)=>{
    const data= req.body.campground;
    const newcamp = new Campground(data);
    newcamp.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    newcamp.author = req.user;
    await newcamp.save();
    req.flash('success','New Campground added!')
    res.redirect(`campgrounds/${newcamp._id}`)
}

module.exports.getNewCampgroundForm =(req,res)=>{
    res.render('campgrounds/newcampground')
}

module.exports.oneCampground = async (req,res,next)=>{
    const {id}=req.params
    const camp=await Campground.findById(id).populate('author').populate({
        path: 'reviews',
        populate: {
            path: 'author'          //populating a Schema that is connect to a related Schema of parent schema(camps)
        }
    });
    // console.log(camp)
    res.render('campgrounds/about',{camp});
    // res.send('hello')
}

module.exports.updateOneCampground = async (req,res,next)=>{
    const {id}= req.params
    const camp =await Campground.findByIdAndUpdate(id,{...req.body.campground})
    if(!camp){
        req.flash('error','Campground not found')
        res.redirect('/campgrounds');
    }
    req.flash('success','Campground Updated!')
    res.redirect(`/campgrounds/${camp._id}`);
    // res.send('getting updated')
}

module.exports.deleteOneCampground= async (req,res,next)=>{
    const {id}=req.params;
    if(!id){
        throw new routerError("No such campground found",401);
    }
    const data = await Campground.findByIdAndDelete(id);
    req.flash('success','Campground deleted successfully!')
    res.redirect(`/campgrounds`)
    // res.send('deleted')
}

module.exports.updateCampgroundForm = async (req,res,next)=>{
    const {id} = req.params
    const camp = await Campground.findById(id)
    if(!camp){
        req.flash('error','Campground not found')
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit',{camp});
}