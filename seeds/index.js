
const mongoose = require('mongoose')
const Campground = require('../models/campground')
const cities = require('./cities');
const {places,descriptors} = require('./seedhelpers')
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp',{useNewUrlParser:true,useUnifiedTopology:true})

const db = mongoose.connection;
db.on('error',console.error.bind(console,"connection error"));
db.once("open",()=>{
    console.log("database connection");
});

const sample = (array)=>{
    return array[Math.floor(Math.random() * array.length)]
}

const seeddb = async()=>{
    await Campground.deleteMany({})
   for(let i=0;i<200;i++){
    const random1000 = Math.floor(Math.random()*1000)
    const price = Math.floor(Math.random()*20) + 10
    const camp =  new Campground({
        author:'64c127c26d63ed9a4459f010',
        location : `${cities[random1000].city},${cities[random1000].state}`,
        title:`${sample(descriptors)} ${sample(places)}`,

        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro, quidem earum perferendis, doloremque vero eos magnam expedita quaerat aliquam, et obcaecati reiciendis. Corrupti doloremque quas fugit consectetur voluptates ducimus vitae?',
      price: price,
      geometry:
      {
        type: 'Point',
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude

        ]
      },

         images: [
            {
                url: 'https://res.cloudinary.com/dkaqttarc/image/upload/v1690471751/yelcamp/yvyqtxrg4oyxtf2dxhrh.jpg',
                filename: 'yelcamp/yvyqtxrg4oyxtf2dxhrh'
              
              },
                {
                  url: 'https://res.cloudinary.com/dkaqttarc/image/upload/v1690471750/yelcamp/x9m5kqvw9daixax94rxy.jpg',
                  filename: 'yelcamp/x9m5kqvw9daixax94rxy'
            
                }
              ]
            
    

    })
    await camp.save()
   }
}

seeddb().then(()=>{
    mongoose.connection.close()
})