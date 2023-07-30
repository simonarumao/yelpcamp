const Campground = require('../models/campground')
const {cloudinary} = require('../cloudinary')
const mbxgeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const maxboxtoken = process.env.MAPBOX_TOKEN;
const geocoder = mbxgeocoding({accessToken:maxboxtoken})
module.exports.index = async(req,res)=>
{
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index',{campgrounds})
}

module.exports.rendernewform = (req,res)=>{
    res.render('campgrounds/new')
}


module.exports.createcampground = async(req,res,next)=>{

    const geodata = await geocoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1
        }).send()
       const campground = new Campground(req.body.campground);
       campground.geometry = geodata.body.features[0].geometry
       campground.images = req.files.map(f=>({
        url:f.path,
        filename:f.filename
    }))
    campground.author = req.user._id
    await campground.save()
    console.log(campground);
    req.flash('success','successfully create a campground ')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showcampground = async(req,res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id).populate({path:'reviews',populate:{path:'author'}}).populate('author')
 
    if(!campground){
        req.flash('error','Cannot find that campground')
        return res.redirect('/campgrounds')
    }

    res.render('campgrounds/show',{campground})

}

module.exports.rendereditform = async(req,res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id)
    if(!campground){
        req.flash('error','Cannot find that campground')
        return res.redirect('/campgrounds')
    }

   
    res.render('campgrounds/edit',{campground})
}

module.exports.updatecampground=async(req,res)=>{
  
    const {id} = req.params

   const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
   const imgs =  (req.files.map(f=>({
    url:f.path,
    filename:f.filename
})))
   campground.images.push(...imgs)

    await campground.save()

    if(req.body.deleteimages){
        for(let filename of req.body.deleteimages){
           await  cloudinary.uploader.destroy(filename)
        }
         await campground.updateOne({
            
            $pull:{images:{filename:{$in:req.body.deleteimages}}}
        })
        console.log(campground);
    }
    req.flash('success','successfully updated campground')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.delete = async(req,res)=>{
    const {id} = req.params
   
    await Campground.findByIdAndDelete(id)
    req.flash('success','successfully deleted campground')
    res.redirect('/campgrounds')
}