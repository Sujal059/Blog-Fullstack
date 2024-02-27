const express = require('express');
const { 
        createCommentCtrl, 
        commentDetailsCtrl, 
        deletecommentCtrl, 
        updatecommentCtrl 

    } = require('../../controllers/comments/comments');
const protected = require('../../middleware/protected');
const commentRoutes = express.Router();



//POST
commentRoutes.post('/:id', protected, createCommentCtrl);

//GET/:id
commentRoutes.get('/:id', commentDetailsCtrl);

//DELETE/:id
commentRoutes.delete('/:id', protected, deletecommentCtrl);

//PUT/:id
commentRoutes.put('/:id', protected, updatecommentCtrl);



module.exports = commentRoutes;