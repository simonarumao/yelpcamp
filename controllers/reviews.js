const Campground = require('../models/campground')
const Review = require('../models/review')
module.exports.createreview = async(req,res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    campground.reviews.push(review)
    await review.save();
    await campground.save();
    req.flash('success','created new Review')
    res.redirect(`/campgrounds/${campground._id}`)


}

module.exports.deletereview = async(req,res)=>{
    const {id,reviewId} = req.params
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success','deleted succesfully')
    res.redirect(`/campgrounds/${id}`)
}