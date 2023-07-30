const express = require('express')

const router = express.Router()
const catchasync = require('../utilis/catchasync')
const Campground = require('../models/campground')
const {isLoggedin,isauthor,validatecampground} = require('../middleware')
const campgrounds = require('../controllers/campgrounds')
const multer = require('multer');
const {storage} = require('../cloudinary')
const upload = multer({storage}) ;


router.route('/')
.get(catchasync(campgrounds.index))
.post(isLoggedin,upload.array('image'),validatecampground,catchasync(campgrounds.createcampground))



router.get('/new',isLoggedin,campgrounds.rendernewform)



router.route('/:id')
.get(catchasync(campgrounds.showcampground))
.put(isLoggedin,isauthor, upload.array('image'),validatecampground,catchasync(campgrounds.updatecampground))
.delete(isLoggedin,isauthor,catchasync(campgrounds.delete))




router.get('/:id/edit',isLoggedin,isauthor,catchasync(campgrounds.rendereditform))






module.exports = router