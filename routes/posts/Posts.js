const express = require('express');
const multer = require('multer');
const storage = require("../../config/cloudinary");
const Post = require('../../models/posts/Post');
const { 
        createPostCtrl, 
        fetchPostsCtrl,
        fetchPostCtrl,
        deletePostCtrl,
        updatePostCtrl,

    } = require('../../controllers/posts/posts');
const postRoutes = express.Router();
const protected = require("../../middleware/protected");


//instance of multer
const upload = multer({storage});

//forms 
postRoutes.get('/get-post-form',(req,res)=>{
    res.render('posts/addPost',{error:''});
})

postRoutes.get('/get-post-form/:id', async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        res.render('posts/updatePost',{post, error:''})
    } catch (error) {
        res.render('posts/updatePost',
        {
            error,
            post: ''
        })
    }
})

//POST
postRoutes.post('/', protected, upload.single('file'), createPostCtrl);

//GET
postRoutes.get('/', fetchPostsCtrl, (req,res)=>{
    res.render('/posts/postDetails',{error:''});
});

//GET/:id
postRoutes.get('/:id', fetchPostCtrl);

//DELETE/:id
postRoutes.delete('/:id', protected, deletePostCtrl);

//PUT/:id
postRoutes.put('/:id', protected, upload.single('file'), updatePostCtrl);



module.exports = postRoutes;
