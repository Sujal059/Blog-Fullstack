const User = require('../../models/users/User');
const Post = require('../../models/posts/Post');
const Comment = require('../../models/comments/Comment');
const appErr = require('../../utils/appErr');


//create-logic
const createCommentCtrl = async(req,res, next)=>{
    const {message} = req.body;
    try {
        //find the post
        const post = await Post.findById(req.params.id);
        //create the comment
        const comment = await Comment.create({
            user: req.session.userAuth,
            message,
            post: post._id,
        });
        //push the comment to post
        post.comments.push(comment._id);
        //find the user
        const user = await User.findById(req.session.userAuth);
        //push comment into user
        user.comments.push(comment._id);
        //disable validation
        //save
        await post.save({validateBeforeSave: false});
        await user.save({validateBeforeSave: false});
        //redirect
        res.redirect(`/api/v1/posts/${post?._id}`)
    } catch (error) {
        next(appErr(error.message));
    }
}

//single comment fetch-logic 
const commentDetailsCtrl = async(req,res, next)=>{
    try {
        const comment = await Comment.findById(req.params.id).populate('user').populate('post');
        res.render('comments/updateComment',{
            comment, error:''
        })
    } catch (error) {
        res.render('comments/updateCommemnt',{
            comment, error: error.message,
        });
    }
}

//delete-logic
const deletecommentCtrl = async(req,res, next)=>{
    try {
        //find the comment
        const comment = await Comment.findById(req.params.id);
        //check if the comment belong to the user
        if(comment.user.toString() !== req.session.userAuth.toString()){
            return next(appErr('You are not allowed to delete this comment', 403));
        }
        //delete comment 
        await Comment.findByIdAndDelete(req.params.id);
         //redirect
         res.redirect(`/api/v1/posts/${req.query.postId}`)
    } catch (error) {
        next(appErr(error.message));
    }
}

//update-logic
const updatecommentCtrl = async(req,res, next)=>{
    try {
        //find the comment
        const comment = await Comment.findById(req.params.id);
        if(!comment){
            return next(appErr('Comment not found'));
        }
        //check if the comment belong to the user
        if(comment.user.toString() !== req.session.userAuth.toString()){
            return next(appErr('You are not allowed to update this comment', 403));
        }
        //update
        const commentUpdated = await Comment.findByIdAndUpdate(req.params.id,{
            message: req.body.message,
        },{
            new: true,
        });
        //redirect
        res.redirect(`/api/v1/posts/${req.query.postId}`)
    } catch (error) {
        next(appErr(error.message));
    }
}



module.exports = {
    createCommentCtrl,
    commentDetailsCtrl,
    deletecommentCtrl,
    updatecommentCtrl
}