const express = require('express')

const router = express.Router({mergeParams:true})
const catchasync = require('../utilis/catchasync')
const expressError = require('../utilis/expressError')
const Campground = require('../models/campground')
const Review = require('../models/review')
const {reviewSchema} = require('../schemas.js')
//const {isLoggedin} = require('../middleware')
const {validatereview,isLoggedin , isreviewauthor} = require('../middleware')
const reviews = require('../controllers/reviews')




router.post('/',isLoggedin,validatereview,catchasync(reviews.createreview))

router.delete('/:reviewId',isLoggedin,isreviewauthor,catchasync(reviews.deletereview))

module.exports = router
