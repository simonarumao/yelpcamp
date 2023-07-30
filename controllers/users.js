const User = require('../models/user');

module.exports.renderregister = (req,res)=>{
    res.render('auth/register')
}

module.exports.register = async(req,res)=>{
    try{
    const {email,username,password} = req.body
    const user = await new User({email,username})
    const registereduser = await User.register(user,password);
    req.login(registereduser,err=>{
        if(err)return next(err)
        req.flash('success','welcome to yelpcamp')
       res.redirect('/campgrounds')
    })
    
    }
    catch(e){
        req.flash('error',e.message)
        res.redirect('/register')
    }
    
}

module.exports.renderlogin = (req,res)=>{
    res.render('auth/login')
}

module.exports.login = (req,res)=>{
    req.flash('success','welcome back');
    const redirecturl = res.locals.returnTo || '/campgrounds'
    delete req.session.returnTo
    res.redirect(redirecturl)
}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}