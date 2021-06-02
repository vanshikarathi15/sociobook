const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;// one we are importing strategy second we are importing a module which will help extract jwt from the header

const ExtractJWT = require('passport-jwt').ExtractJwt;

const User = require('../models/user');

let opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), 
    // header is a list of keys, header has a key called authorization that has all keys, that is called as bearer, that bearer will have JWT token
    secretOrKey: "sociobook"
}

passport.use(new JWTStrategy(opts, function(jwtPayLoad, done){
    User.findById(jwtPayLoad._id, function(err, user){
        if(err){console.log('Error in finding user from JWT'); return;}

        if(user){
            return done(null, user);
        }else{
            return done(null, false);
        }
    })
}));



module.exports = passport;