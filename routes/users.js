const express = require('express')
const router = express.Router();
const User = require('../models/user');
const catchasync = require('../utilis/catchasync');
const passport = require('passport');
//const expressError = require('../utilis/expressError')
const {storeReturnTo} = require('../middleware')
const users = require('../controllers/users')

router.route('/register')
.get(users.renderregister)
.post(catchasync(users.register))

router.route('/login')
.get(users.renderlogin)
.post(storeReturnTo,passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(users.login))

router.get('/logout', users.logout); 
module.exports = router;