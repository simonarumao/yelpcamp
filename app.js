if (process.env.NODE_ENV !== "production") {
    console.log(process.env.NODE_ENV);
    require('dotenv').config();
}


const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const ejsmate = require('ejs-mate')
const session = require('express-session')
const MongoDBStore = require("connect-mongo")(session)
const flash = require('connect-flash')
const expressError = require('./utilis/expressError')
const methodoverride = require('method-override')
const passport = require('passport')
const localstrategy = require('passport-local')
const User = require('./models/user')
const mongosanitize = require('express-mongo-sanitize')
const helmet = require('helmet')





// routes require
const campgrounds = require('./routes/campgrounds')
const reviews = require('./routes/reviews')
const userroutes = require('./routes/users')
const dbUrl = 'mongodb://127.0.0.1:27017/yelp-camp'
// mongodb://127.0.0.1:27017/yelp-camp
//db connect
mongoose.connect(dbUrl,{useNewUrlParser:true,useUnifiedTopology:true})
const db = mongoose.connection;
db.on('error',console.error.bind(console,"connection error"));
db.once("open",()=>{
    console.log("database connection");
});


//middlewares
app.engine('ejs',ejsmate)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(express.urlencoded({extended:true}))
app.use(methodoverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongosanitize())



//session

const store = new MongoDBStore({
    url: dbUrl,
    secret: 'thisshouldbeasecret',
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log('session store');
})

const sessionconfig = {
    store,
    name:'session',
    secret:'thishouldabettersecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly: true,
        //secure:true,
        expires:Date.now() + 1000*60*60*24 * 7,
        maxAge: 1000*60*60*24 * 7.
        
    }

}

app.use(session(sessionconfig))

//flash 

app.use(flash())



//passport

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localstrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{

    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})



//using routes middleware
app.use('/campgrounds',campgrounds)
app.use('/campgrounds/:id/reviews',reviews)
app.use('/',userroutes)



app.get('/',(req,res)=>
{
    res.render('home')
})





app.all('*',(req,res,next)=>{
    next(new expressError('Page not found',404))
})

app.use((err,req,res,next)=>{
    const {statuscode = 500} = err;
    if(!err.message)
    {
        err.message = 'oh no '
    }
    res.status(statuscode).render('error',{err})
   
})


app.listen(3000,()=>{
    console.log('running on port 3000');
})