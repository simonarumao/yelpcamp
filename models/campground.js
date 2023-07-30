const mongoose = require('mongoose');
const review = require('./review')
const { campgroundSchema } = require('../schemas');
const Schema = mongoose.Schema;

//https://res.cloudinary.com/dkaqttarc/image/upload/v1690471751/yelcamp/yvyqtxrg4oyxtf2dxhrh.jpg
const imageschema = new Schema({
    url:String,
    filename:String
});
imageschema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200')
})
const opts = {toJSON:{virtuals:true}}


const campgroundschema = new Schema({
    title:String,
    images:[
        imageschema
    ],
    geometry:{
        type:{
            type:String,
            enum:['Point'],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    },
    price:Number,
    description:String,
    location:String,
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    reviews : [
        {
            type: Schema.Types.ObjectId,
            ref:"Review"
        }
    ]
},opts);

campgroundschema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0,20)}...</p>` 
})


campgroundschema.post('findOneAndDelete',async function(doc){
  if(doc){
    await review.deleteMany({
        _id:{
            $in:doc.reviews
        }
    })
  }
})




module.exports = mongoose.model('Campground',campgroundschema)

