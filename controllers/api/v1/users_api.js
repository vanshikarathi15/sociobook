//users api has been created and its route is defined in routes/api/v1/user.js

const User = require('../../../models/user');
const jwt = require('jsonwebtoken');

module.exports.createSession = async function(req, res){
    //wehenever the username and pw is received we need to find the user and generate the web token corresponding to that user
    try{
        let user = await User.findOne({email: req.body.email});

        // if we have the found the user
        if(!user || user.password != req.body.password){
            return res.json(422, {
                message: "Invali Username or Password"
            });
        }

        return res.json(200, {
            message: "Sign in successfull, here is your token , please keep it safe",
            data: {
                // token pass kr rhe h jb user mil jyga using jwt library user.toJSON this is the part which get descrypyted
                token: jwt.sign(user.toJSON(), 'sociobook', {expiresIn: '100000'})
            }
        });
    }catch(err){
        console.log('******', err);
        return res.json(500, {
            message: "Internal server error"
        });
    }
}