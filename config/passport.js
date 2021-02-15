var passport = require('passport');
 const localStrategy = require('passport-local').Strategy // creating our strategy for Authenticate
const mongoose = require('mongoose'); // check matches 
const bcrypt = require('bcrypt');

const user = require('../model/User_model');

module.exports=  function(passport) {

    passport.use
    (  'local',
        new localStrategy({usernameField: 'email'}, (email,password,done)=>{

            // match user

            user.findOne({email:email}).then((user)=>{
              
                if(!user)
                {
                    return done(null,false,{message :"email is not register"})
                }
                else
                {
                    // checking password

                    bcrypt.compare(password,user.password,(err,isMatch)=>{

              if(isMatch)
              {
                  done(null,user);
              } 

              else
              {
                  done(null,false,{message:"password incorrect"})
              }
                    })

                }
            })
        })
    )

    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
       user.findById(id, function(err, user) {
          done(err, user);
        });
      });

}