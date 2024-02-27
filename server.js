require('dotenv').config({path : "./utils/.env"});
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const userRoutes = require('./routes/users/Users');
const postRoutes = require('./routes/posts/Posts');
const commentRoutes = require('./routes/comments/Comments');
const globalErrHandler = require('./middleware/globalHandler');
const Post = require('./models/posts/Post');
const { truncatePost } = require('./utils/helpers');


// dotenv.config();   //config .evn file
require('./config/dbConnnect');

const app = express();

//helpers
app.locals.truncatePost = truncatePost;

//middleware

//configure ejs
app.set('view engine', "ejs");
//serve static files
app.use(express.static(__dirname +'/public'));


app.use(express.json())  //pass incoming data  --it is for json data
app.use(express.urlencoded({extended: true})); //passing frontend data to backend

//method override config
app.use(methodOverride("_method"));

//session config
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
        mongoUrl: process.env.MONGO_URL,
        ttl: 24*60*60   //1day
    })
}));


//save the login user into the local
app.use((req, res, next)=>{
    if(req.session.userAuth){
        res.locals.userAuth = req.session.userAuth;
    }else{
        res.locals.userAuth = null;
    }
    next();
})

//render homepage
app.get('/', async(req, res)=>{
   try {
    const posts = await Post.find().populate('user');
    res.render("index", {posts});
   } catch (error) {
    res.render('index', {error:error.message});
   }
   
})
//users route
app.use('/api/v1/users', userRoutes);

//posts routes
app.use('/api/v1/posts', postRoutes);

//cooments routes
app.use('/api/v1/comments', commentRoutes);

//Error handler middleware
app.use(globalErrHandler);


//listen server
const PORT = process.env.PORT || 7000;
app.listen(PORT, console.log(`Server is running on PORT ${PORT}`));
