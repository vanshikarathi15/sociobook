const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy; // this is rquiring passport local library and specifically strategy requrie krna h

const User = require('../models/user')
//now next step we requrie user
//we need to tell passport local strategy that we have created
//authentication using passport
//finding the user who sigined in
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true  //ye line sir passReq wla tb set kia h noty wale me; this basically allow us to set the first argument as request
    },
    function(req, email, password, done){//done is inbuilt to passport it is automatically called
        //done is callback function which is reporting back to passport.js
        //find a user and establish the identity
        User.findOne({email: email}, function(err, user){
            if(err){
                req.flash('error', err);
                return done(err);//this will report an error to passport
                //done takes two argument
            }
            //if the user is found,if found but  password doesnt match
            if(!user || user.password != password){
                req.flash('error','Invalid Username/Password');
                return done(null, false);
            }
            //if useer found
            return done(null, user);

        });

    }

));

//serializing the user to decide which key is to be kept in the cookies
//setting userid in encrypted format into the cookies
passport.serializeUser(function(user, done){
    done(null, user.id);// to set the user id into cookie
});

//deserializing the user from the key in the cookies
//kaun user request bhj rha h
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err){
            console.log('Error in Finding user --> Passport');
            return done(err);
        }
        return done(null, user);
    });
});


//check if the user is authenticated
passport.checkAuthentication = function(req, res, next){
    //if user is signed in, then pass on the request to the next function(controllers action)
    if(req.isAuthenticated()){//this detects whether the user is signed in or not
        return next();
    }
    //if the user is  not signed in
    return res.redirect('/users/sign-in');
}
passport.setAuthenticatedUser = function(req, res, next){
    if(req.isAuthenticated()){
        //req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views
        res.locals.user = req.user;
    }
    next();
}


module.exports = passport;