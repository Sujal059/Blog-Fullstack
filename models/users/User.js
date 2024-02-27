const mongoose = require('mongoose');

//Schema
const userSchema = new mongoose.Schema(
    {
        fullname:{
            type: String,
            required: true,
        },
        email:{
            type: String,
            required: true,
        },
        password:{
            type: String,
            required: true,
        },
        profileImage:{
            type: String,
        },
        coverImage:{
            type: String,
        },
        role:{
            type: String,
            default: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut, non facilis. Autem nostrum explicabo dicta repellendus perferendis rationefacere!",
        },
        bio:{
            type: String,
            default: 'Blogger',
        },
        posts: [{type: mongoose.Schema.ObjectId, ref: 'Post'}],
        comments: [{type: mongoose.Schema.ObjectId, ref: 'Comment'}]
    },
    {
        timestamps: true,
    }
);

//compile the schema to form a model
const User = mongoose.model('User', userSchema);

module.exports = User;