const User = require('../models/user');
const fs = require('fs');
const path = require('path');


//ye profile jo likhe h ye variable h(ye pehle aaya h baad me upar wala manual authne)
module.exports.profile = function(req, res){
    // res.end('<h1> User Profile </h1>');
    
    //now this controller is ready to access by the router
    //ye line databse updating wala se aa rha bs User.fid wala
    User.findById(req.params.id, function(err, user){
        return res.render('user_profile', {
            title: "User Profile",
            profile_user: user
        });
    });
 
}
//ye wala Deleting and Updating Objects in Database + Distributing Views
module.exports.update = async function(req, res){
    // if(req.user.id == req.params.id){
    //     User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
    //         return res.redirect('back');
    //     });
    // }else{
            // req.flash('error', 'Unauthorized');
    //     return res.status(401).send('Unauthorized');
    // }
    if(req.user.id == req.params.id){
        try{
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err){
                if(err){console.log('****Multer Error:', err)}

                // console.log(req.file);
                user.name = req.body.name;
                user.email = req.body.email;

                if(req.file){
                    if(user.avatar){
                        // for deleteting we need a module fs(file system)and also a path module, bcz we are deleting from a path
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));

                    }
                    // this is saving the path of the uploaded file into the avatar field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');

            });

        }catch(err){
            req.flash('error', err);
            return res.redirect('back');
        }

    }else{
        req.flash('error', 'Unauthorized');
        return res.status(401).send('Unauthorized');
    }


}

// render the sign up page
module.exports.signUp = function(req, res){
    //now we will do sign up and signin page avilable only when user is signed out
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }


    return res.render('user_sign_up', {
        title: "Sociobook | Sign Up"
    });
}

// render the ssign in page
module.exports.signIn = function(req, res){
    //now we will do sign up and signin page avilable only when user is signed out
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_in', {
        title: "Sociobook | Sign In"
    });
}

//get up the sign up data
module.exports.create = function(req, res){
    if(req.body.password != req.body.confirm_password){
        req.flash('error','Passwords do not match');
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err, user){
        if(err){console.log('error in finding user in signing up'); return}

        if(!user){
            User.create(req.body, function(err, user){
                if(err){console.log('error in creating user while signing up'); return}

                return res.redirect('/users/sign-in');
            });
        }else{
            req.flash('success', 'You have signed up, login to continue');
            return res.redirect('back');
        }
    });
}

//sign in and create a session for the user
module.exports.createSession = function(req, res){
    
    req.flash('success', 'Logged In successfully');//ye flash message h(first argumnet type which is setting as sucess kh v rkj skte the abcd v)
    //to pass these flash mesage to html or ejs tempelate we have to create middlware which i have created in config, which fetches everyhting from req flash and puts into locals and finnally use krkne ke lia index .js me jaake app.use(customMware.setFLas)...so to access this in template layout .ejs me jaake krenge 
    return res.redirect('/');
}


//ye kab banaye h jb signout banaye h
//signout is basically removing the user's session cookie to remove the identity
module.exports.destroySession = function(req, res){
    // before redirecting we need to logout
    req.logout();//this is given by passport
    req.flash('success', 'Logged Out successfully');
    
    return res.redirect('/');
}