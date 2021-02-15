const express = require('express');
const app = express();
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require('express-session')
// db config
const db = require('./config/key').mongoURI;
const passport = require('passport')

// passport config
// connect to mongo  using mongoose 
mongoose.connect(db, { useNewUrlParser:true})
.then(()=>{console.log("connected");}).catch((err=>{console.log("error",err);})) 

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended:false}));

// creating Session 
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  
}))

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// use flash
app.use(flash());


// Global Variable
app.use((req,res,next)=>{  
  
  // use locally in response 
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error'); 
 next();        
})

// Routes 

app.use('/', require('./user/index'));
app.use('/user', require('./user/user'));





app.listen(3000, ()=>{

  console.log("Listening at port 3000");
});
