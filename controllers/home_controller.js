//ye post jv se banaye h tb ye line
const Post = require('../models/post');
const User = require('../models/user');
// MANY ACTION IN ONE FILE CALLED AS CONTROLLER, a controller is a set of different actions
module.exports.home = async function(req, res){
    // return res.end('<h1> Express is up for sociobook </h1>');
    // console.log(req.cookies);
    // res.cookie('user_id',25);

    // Post.find({}, function(err, posts){
    //     return res.render('home', {
    //         title: "Sociobook | Home",
    //         posts: posts
    //     });
    // });

    //popultae the user of each post 
    //yhi se suru hua h display wala step1
    //hmko id show ni krna h hmko usse assiciated name ya email dena  toa islia  hm populate kr rhe h or ye exec baaaki ka remainign function likhna h iske andar,mtb call back iske andar likhna hoga
    // Post.find({}).populate('user').exec(function(err, posts){
    //     return res.render('home', {
    //         title: "Sociobook | Home",
    //         posts: posts
    //     });
    // })
    //to handle error (async await)
    try{
        //Change :: populate the likes of each post and comment
        //when you want populate  multiple models
        let posts = await Post.find({})
        .sort('-createdAt')//ye line bs sorted order me krega post
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
            path: 'user'
        },
        populate: {
            path: 'likes'// this is for the comments
        }
    }).populate('likes');//this is for the post
    
    let users = await User.find({});
    
        return res.render('home', {
            title: "Sociobook | Home",
            posts: posts,
            all_users: users
        });

    }catch(err){
        
        console.log('Error', err);
        return;
     }
}