const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId
    },
    // this defines the object id of the liked object
    //the object on which is like is callable
    likeable: {
        type: mongoose.Schema.ObjectId,
        required: true,
        refPath: 'onModel'// refPath means we are going to place a path to some other field which is there and that field is going to define on which type of object  like is called
    },
    // this field is used for defining the type of the likes object share this is a dynamic reference
    onModel: {
        type: String,
        required: true,
        enum: ['Post', 'Comment']//enum means it tell that like value of on model is either post or comment bs ye do chij ho we have declare the values ovr here
    }

}, {
    timestamps: true
});

const Like  = mongoose.model('Like', likeSchema);
module.exports = Like;