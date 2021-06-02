const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

//tell passport to use a new strategy for google login
passport.use(new googleStrategy({
        clientID: "948418707234-r7553jj76ihnucda83kglccv23chd578.apps.googleusercontent.com",
        clientSecret: "tGcNVkzDX5Sbj-hCzeNiTQSH",
        callbackURL: "http://localhost:8000/users/auth/google/callback",
    //this callback url wil be matched with the google


    },

    function(accessToken, refreshToken, profile, done){
        // find a user
        User.findOne({email: profile.emails[0].value}).exec(function(err, user){
            if(err){console.log('error in google starategy passport', err); return;}
            console.log(accessToken, refreshToken);
            console.log(profile);
            if(user){
                // if found set the user as req.user
                return done(null, user);
            }else{
                // if not found, create the user and set it as req.user(sigining in thw user) 
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                }, function(err, user){
                    if(err){console.log('error in creating user google strategy passport', err); return;}

                    return done(null, user);

                });
            }
        });
    }

));

module.exports = passport;