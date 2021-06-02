const Post = require('../models/post');
const Comment = require('../models/comment');//these line islia import kia q ki hme comment v deleete krna h q ki jb post delete hoga tb b toa comment v jhyga na
const Like = require('../models/like');

module.exports.create = async function(req, res){
    try{
        let post = await Post.create({
            //HOME.EJS ME KO TEXT AREA ME NAAM H CONTENT WHI HOGA IDHR,or post.js me v conteent hi define kia ho
            content: req.body.content,
            user: req.user._id//ye user id islia h taaki pta rhe kaun user ka post kia
        });

        //ye line convertinf to ajax se aayega
        if(req.xhr){
            // if we want to populate just the name of the user (we will not want to send the password in the api), this is how we will do it
            post = await post.populate('user', 'name').execPopulate();
            
            return res.status(200).json({
                data: {
                    post: post
                },
                message: "Post created!"
            });
        }

        req.flash('success','Post published');
        return res.redirect('back');

    }catch(err){
        // console.log('Error', err);
        req.flash('error',err);
        // added this to view the error on cosnole as weelll babuaa
        console.log(err);
        return res.redirect('back');
    }
    
    
}

module.exports.destroy = async function(req, res){
    try{
        let post = await Post.findById(req.params.id);

        //.id means converting the object id into string
        if(post.user == req.user.id){//post == user the user who is deleting a post, who is written the post  

            // change :: delete the associated likes for the post and all its comment likes too
            await Like.deleteMany({likeable: post, onModel: 'Post'});
            await Like.deleteMany({_id: {$in: post.comments}});


            post.remove();
            
            await Comment.deleteMany({post: req.params.id});
            
            if(req.xhr){
                return res.status(200).json({
                    data:{
                        post_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }

            req.flash('success','Post and associated comments deleted!');
            return res.redirect('back');
        }else{
            req.flash('error','You can not delete this post');
            return res.redirect('back');
        }


    }catch(err){
        // console.log('Error', err);
        req.flash('error',err);
        return res.redirect('back');
    }
}