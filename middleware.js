
const {campgroundSchema} = require('./schemas.js')
const expressError = require('./utilis/expressError')
const Campground = require('./models/campground')
const {reviewSchema} = require('./schemas.js')
const Review = require('./models/review.js')




module.exports.isLoggedin = (req,res,next)=>{
    if(!req.isAuthenticated()){
    req.session.returnTo = req.originalUrl
    req.flash('error','you must be signed in ')
    return res.redirect('/login')
}

next()
}

module.exports.storeReturnTo = (req,res,next)=>{
    if(req.session.returnTo){
        res.locals.returnTo = req.session.returnTo
    }
    next()
}


module.exports.validatecampground = (req,res,next)=>{
    const {error} = campgroundSchema.validate(req.body)


    if(error){
        const msg = error.details.map(el=>el.message).join(',')
        throw new expressError(msg,400)
    }
    else{
        next()
    }
}

module.exports.isauthor = async(req,res,next)=>{
    const {id} = req.params
    const campground = await Campground.findById(id)
    if(!campground.author.equals(req.user._id)){
        req.flash('error','you do not have permission')
        return res.redirect(`/campgrounds/${id}`)

    }
    else{
        next()
    }
}


module.exports.isreviewauthor = async(req,res,next)=>{
    const {id,reviewId} = req.params
    const review = await Review.findById(reviewId)
    if(!review.author.equals(req.user._id)){
        req.flash('error','you do not have permission')
        return res.redirect(`/campgrounds/${id}`)

    }
    else{
        next()
    }
}
module.exports.validatereview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el=>el.message).join(',')
        throw new expressError(msg,400)
    }
    else{
        next()
    }


}