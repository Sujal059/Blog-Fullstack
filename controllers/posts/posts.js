const Post = require("../../models/posts/Post");
const User = require("../../models/users/User");
const appErr = require("../../utils/appErr");

//create-logic
const createPostCtrl = async(req,res, next)=>{
    const {title, description, category, user} = req.body;
    try {
        if(!title || !description || !category || !req.file){
            return res.render('posts/addPost',{error:'All fields are required'});
        }
        //find the user
        const userId = req.session.userAuth;
        const userFound = await User.findById(userId);
        //create the post
        const postCreated = await Post.create({
            title,
            description,
            category,
            user: userFound._id,
            image: req.file.path
        });
        //push the post created into the array of user's posts
        userFound.posts.push(postCreated._id);
        //resave 
        await userFound.save();
        //redirect
        res.redirect('/');
    } catch (error) {
        return res.render('posts/addPost',{error:error.message});
    }
}

//all post fetch-logic
const fetchPostsCtrl =async(req,res, next)=>{
    try {
        const posts = await Post.find().populate('comments').populate('user');
        res.render("posts/allPosts", {posts})
    } catch (error) {
        next(appErr(error.message));
    }
}

//single post fetch-logic
const fetchPostCtrl = async(req,res,next)=>{
    try {
        //get the post from params
        const id = req.params.id;
        //find the post
        const post = await Post.findById(id).populate({
            path: "comments",
            populate: {
                path: "user",
            }
        }).populate("user");
        res.render('posts/postDetails',{
            post, error: '',
        })
    } catch (error) {
        next(appErr(error.message));
    }
}

//delete-logic
const deletePostCtrl = async(req,res, next)=>{
    try {
        //find the post
        const post = await Post.findById(req.params.id);
        //check if the post belong to the user
        if(post.user.toString() !== req.session.userAuth.toString()){
            return res.render('posts/postDetails', {
                error: "You are not authorized to delete this post",
                post: '',
            });
        }
        //delete post 
        await Post.findByIdAndDelete(req.params.id);
        res.redirect("/");
    } catch (error) {
        return res.render('posts/postDetails', {
            error: error.message,
            post: '',
        });
    }
}

//update-logic
const updatePostCtrl = async(req,res, next)=>{
    const {title, description, category} = req.body;
    try {
        //find the post
        const post = await Post.findById(req.params.id);
        //check if the post belong to the user
        if(post.user.toString() !== req.session.userAuth.toString()){
            return res.render('posts/postDetails', {
                error: 'You are not authorized to update this post',
                post: '',
            });
        }
        //check if user is updating the image
        if (req.file) {
            //update
            await Post.findByIdAndUpdate(req.params.id,{
                title,
                description,
                category,
                image: req.file.path,
            },{
                new: true,
            });
        }else{
             //update
            await Post.findByIdAndUpdate(req.params.id,{
                title,
                description,
                category,
            
            },{
                new: true,
            });
        }
        
        res.redirect("/")
    } catch (error) {
        return res.render('posts/postDetails', {
            error: error.message,
            post: '',
        });
    }
}


module.exports = {
    createPostCtrl,
    fetchPostsCtrl,
    fetchPostCtrl,
    deletePostCtrl,
    updatePostCtrl
}