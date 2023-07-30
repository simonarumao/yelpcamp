
const mongoose = require('mongoose')
const passportlocalmongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userschema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    }
})

userschema.plugin(passportlocalmongoose);

module.exports = mongoose.model('User',userschema)
