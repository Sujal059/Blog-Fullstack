const express = require('express');
const { 
        registerCtrl,
        loginCtrl,
        userDetailsCtrl, 
        profileCtrl,
        uploadProfilePhotoCtrl, 
        uploadCoverPhotoCtrl,
        updatePasswordCtrl,
        updateUserCtrl,
        logoutCtrl,
        
    } = require('../../controllers/users/users');
const protected = require("../../middleware/protected"); 
const storage = require('../../config/cloudinary');
const multer = require('multer');
const userRoutes = express.Router();

//instance of multer
const upload = multer({storage});


//------
//Rendring Froms
//------
//login form
userRoutes.get('/login',(req, res)=>{
    res.render("users/login",{
        error: '',
    });
});
//register form
userRoutes.get('/register',(req, res)=>{
    res.render("users/Register",{
        error: '',
    });
});

//upload profile photo
userRoutes.get('/upload-profile-photo-form',(req, res)=>{
    res.render("users/uploadProfilePhoto",{
        error: "",
    });

});
//upload cover photo
userRoutes.get('/upload-cover-photo-form',(req, res)=>{
    res.render("users/uploadCoverPhoto", {error: ''});
});
// //update user-password
userRoutes.get('/update-user-password',(req, res)=>{
    res.render("users/updatePassword", {error:''});
});



//POST/register
userRoutes.post('/register', registerCtrl);

//POST/login
userRoutes.post('/login', loginCtrl);

//GET/profile
userRoutes.get('/profile-page', protected, profileCtrl);

//PUT/profile-photo-upload
userRoutes.put('/profile-photo-upload', protected, upload.single('profile'), uploadProfilePhotoCtrl);

//PUT/cover-photo-upload
userRoutes.put('/cover-photo-upload', protected, upload.single('profile'), uploadCoverPhotoCtrl);

//GET/logout
userRoutes.get('/logout', logoutCtrl);

//PUT/update-password
userRoutes.put('/update-password', updatePasswordCtrl);

//PUT/update/
userRoutes.put('/update', updateUserCtrl);

//GET/:id
userRoutes.get('/:id', userDetailsCtrl);



module.exports = userRoutes;