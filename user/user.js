const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport')
// bring our model 
const user = require('../model/User_model');

router.get('/', (req, res) => { res.send("welcome user"); })
router.get('/login', (req, res) => { res.render('login'); })
router.get('/register', (req, res) => { res.render('register'); })
router.get('/dashboard', (req,res,next)=>{
    if(req.isAuthenticated()) // is req.logout performed here must not log out
    {
        next();
        
    }
    else
    {
        req.flash('error','You must login first');
        res.redirect('/user/login')
    }
},(req, res) => { res.render('dashboard',{

username:req.user.username

}); })
router.post('/register', (req, res) => {
    const { username, email, password, password2 } = req.body;

    let error = []
    if (!username || !email || !password || !password2) {
        error.push("Fill out all the field");
        console.log("fill out all the field");
    }
    if (password != password2) {
        error.push("password doesn't match");;
    }
    if (error.length > 0) {

        res.render('register', {
            error,
            username,
            email,
            password,
            password2
        });
    } else {

        user.findOne({ email: email }).then(User => {


            if (User) {
                // user Exist      
                //    console.log("user exist");
                error.push("Email already exist")
                res.render('register', {
                    error
                })
            } else {
                //  


                // Making new user with our model Structure

                const newUser = new user({
                    username,
                    email,
                    password
                });

                // Hash password 
                bcrypt.genSalt(10, (err, salt) => {

                    bcrypt.hash(password, salt, (err, hash) => {

                        newUser.password = hash;
                        newUser.save((err, newUser) => {})
      req.flash('success_msg', 'you are now log in') // request for flash message
                        res.redirect('login'); // local variable with response

                    })
                })


            }

        })

    }
})


// login handle 
router.post('/login', (req,res , next)=>{

    // authenticate our login data using our stragies which do that find in mongodb databse using mongoose  
    passport.authenticate('local',{
successRedirect:'/user/dashboard',  // this will return user and flash msg
failureRedirect:'/user/login',
failureFlash:true
    })(req,res,next);
})

// log out  handle

router.get('/logout',(req,res)=>{
   req.logOut();
    req.flash('success_msg','you are logged out');
    res.redirect('/user/login');
})

module.exports = router;