const mongoose = require('mongoose');

// importing multer y we are not uploading multer into config folder but in user page, reason bcz we are uploading the files specific to user and we have some specific setting users avatar willl be uploaded at different place for ex if u posting that will be uplaoded at different place, posting an image,so we are setting up multer individually for each model all the you can centralised approach of it..but for now lets go with this
const multer = require('multer');
const path = require('path');
const AVATAR_PATH = path.join('/uploads/users/avatars');

const userScehma = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    }
},

    

{
    timestamps: true
    // ye timestamp show krega created at signed in at update at
});

//getting this saved to /uploads/users/avatars' to ye uska setting h neeche wala line sb
let storage = multer.diskStorage({
    destination: function (req, file, cb) {//cb means callback function
      cb(null, path.join(__dirname, '..',AVATAR_PATH));
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now());
      //file.fieldname feildname means avatar here so ye jo jb v upload hoyega avatar + date now
    }
  });


//statics function can be called overalled on whole class
userScehma.statics.uploadedAvatar = multer({storage: storage}).single('avatar');
//this .single says that only one instance only one file willl be uploaded for the field name avatar not multiple file

userScehma.statics.avatarPath = AVATAR_PATH;

const User = mongoose.model('User', userScehma);

module.exports = User;