const bcrypt = require('bcryptjs');
const User = require('../../models/users/User');
const appErr = require('../../utils/appErr');

//register-logic
const registerCtrl = async(req,res, next)=>{
    const {fullname, email, password} = req.body;
    //check if the field is empty
    if(!fullname || !email || !password){
        return res.render('users/register',{error:"All fields are required"})
    }
    try {
        //1.check if user exist (email)
        const userFound = await User.findOne({email});
        //throwerror
        if(userFound){
            return res.render('users/register',{error:"user already exists"})

        }
        //hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHashed = await bcrypt.hash(password, salt);

        //register user
        const user = await User.create({
            fullname,
            email,
            password: passwordHashed,
        });
        //redirect
        res.redirect('/api/v1/users/login');

    } catch (error) {
        res.json(error);
    }
}

//login-logic
const loginCtrl = async(req,res, next)=>{
    const {email, password} = req.body;
    //check if the field is empty
    if(!email || !password){
        return res.render('users/login',{error:"Email and Password fields are required"});
    }
    try {
        //1.check if email exist or not
        const userFound = await User.findOne({email});
        if(!userFound){
            //throw error
            return res.render('users/login',{error:"Invalid Login credentials"});
        }
        //verify password
        const isPasswordValid = await bcrypt.compare(password, userFound.password);
        if(!isPasswordValid){
            //throw error
            return res.render('users/login',{error:"Invalid Login credentials"});
        }
        //save the user into session
        req.session.userAuth = userFound._id;
       //redirect
       res.redirect('/api/v1/users/profile-page');
    } catch (error) {
        res.json(error);
    }
}

//details-logic
const userDetailsCtrl = async(req,res)=>{
    try {
        //get user id from params
        const userID = req.params.id;
        //find the user
        const user = await User.findById(userID);
        res.render('users/updateUser',{
            user,
            error: '',
        })
    } catch (error) {
        res.render('users/updateUser',{
            error: error.message,
        })
    }
}

//profile-logic
const profileCtrl = async(req,res)=>{
    try {
        //get the login user
        const userID = req.session.userAuth;
        //find the user
        const user = await User.findById(userID).populate('posts').populate('comments');  //we used populate to have the whole post and comment in user rather than just its id
        res.render('users/profile', {user});
    } catch (error) {
        res.json(error);
    }
}

//upload profile photo-logic
const uploadProfilePhotoCtrl = async(req,res,next)=>{
    try {
        //check if file exist
        if(!req.file){
            return res.render('users/uploadProfilePhoto',{
                        error: 'Please upload image'
                    })
        }
        //find the user
        const userId = req.session.userAuth;
        const userFound = await User.findById(userId);
        //check if user is found
        if(!userFound){
            return res.render('users/uploadProfilePhoto',{
                error: 'User not found',
            })
        }
        //update profile photo
        await User.findByIdAndUpdate(userId,{
            profileImage: req.file.path,
        },{
            new: true,
        });
        //redirect
        res.redirect("/api/v1/users/profile-page")
    } catch (error) {
        return res.render('users/uploadProfilePhoto',{
            error: error.message,
        })
    }
}

//upload cover photo-logic
const uploadCoverPhotoCtrl = async(req,res,next)=>{
    try {
        //check if file exist
        if(!req.file){
            return res.render('users/uploadCoverPhoto',{
                        error: 'Please upload image'
                    })
        }
        //find the user
        const userId = req.session.userAuth;
        const userFound = await User.findById(userId);
        //check if user is found
        if(!userFound){
            return res.render('users/uploadCoverPhoto',{
                error: 'User not found'
            });
        }
        //update cover photo
        await User.findByIdAndUpdate(userId,{
            coverImage: req.file.path,
        },{
            new: true,
        });
        //redirect
        res.redirect('/api/v1/users/profile-page')
   
    } catch (error) {
        return res.render('users/uploadCoverPhoto',{
            error: error.message,
        })
    }
}

//update password-logic
const updatePasswordCtrl = async(req,res, next)=>{
    const {password} = req.body;
    try {
        //Check if user is updating the password
        if(password){
            const salt = await bcrypt.genSalt(10);
            const passwordHashed = await bcrypt.hash(password, salt);
        
            //update user
            await User.findByIdAndUpdate(req.session.userAuth, {
                password: passwordHashed,
            },{
                new: true,
            });
        }

        
        res.json({
            status: 'Success',
            user: 'Password has changed successfully'
        })
    } catch (error) {
        return res.render('users/login',{error:error.message});
    }
}

//update user-logic
const updateUserCtrl = async(req,res, next)=>{
    const {fullname, email} = req.body;
    try {
        if(!fullname || !email){
            return res.render('users/updateUser',{
                error: "Please provide all the details",
                user:'',
            })
        }

        //check if the email is taken or not
        if(email){
            const emailTaken = await User.findOne({email});
            if(emailTaken){
                return res.render('users/updateUser',{
                    error: "Email is taken",
                    user:'',
                })
            }
        }
        //update the user 
        const user = await User.findByIdAndUpdate(req.session.userAuth, {
            fullname, 
            email,
        },{
            new: true,
        });
        res.redirect('/api/v1/users/profile-page')
    } catch (error) {
        return res.render('users/updateUser',{
            error: error.message,
            user: '',
        })
    }
}

//logout-logic
const logoutCtrl = async(req,res)=>{
    
        //destroy session
        req.session.destroy(()=>{
            res.redirect('/api/v1/users/login');
        })
    
}

module.exports = {
    registerCtrl,
    loginCtrl,
    userDetailsCtrl,
    profileCtrl,
    uploadProfilePhotoCtrl,
    uploadCoverPhotoCtrl,
    updatePasswordCtrl,
    updateUserCtrl,
    logoutCtrl
};