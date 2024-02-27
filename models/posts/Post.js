const mongoose = require('mongoose');

//Schema
const postSchema = new mongoose.Schema(
    {
        title:{
            type: String,
            required: true,
        },
        description:{
            type: String,
            required: true,
        },
        category:{
            type: String,
            required: true,
            enum: ["react js", "html", "css", "node js", "javascript", "other"],   //accepted category
        },
        image:{
            type: String,
            required: true,
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true
        },
        comments:[{
            type: mongoose.Schema.ObjectId,
            ref: 'Comment',
        }],
    },
    {
        timestamps: true,
    }
);

//compile the schema to form a model
const Post = mongoose.model('Post', postSchema);

module.exports = Post;