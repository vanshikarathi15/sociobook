const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index = async function(req, res){
    //index is genreally usually use when u want to list down something as an action name
   
    let posts = await Post.find({})
        .sort('-createdAt')//ye line bs sorted order me krega post
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
            path: 'user'
        }
    });
    
    return res.json(200, {
        message: "List of posts",
        posts: posts
    })
}

module.exports.destroy = async function(req, res){
    try{
        let post = await Post.findById(req.params.id);

        //.id means converting the object id into string
        if(post.user == req.user.id){//post == user the user who is deleting a post, who is written the post  
            post.remove();
            
            await Comment.deleteMany({post: req.params.id});
            // await Comment.findByIdAndRemove({post: req.params.id}); ni kaam kre toa ye try kro
            return res.json(200, {
                message: "Post and associated comments deleted!"
            });
        }else{
            return res.json(401, {
                message: "you cannot delete this post"
            })
        }


    }catch(err){
        // console.log('Error', err);
        // req.flash('error',err);
        console.log('******', err);
        return res.json(500, {
            message: "Internal server error"
        });
    }
}
