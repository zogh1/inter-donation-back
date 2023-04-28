var express = require('express');
const post = require('../models/post');
var router = express.Router();
var Post = require('../models/post');
var multer = require('multer');
var path = require('path');
const postController = require('../controllers/post.controller')


const storage = multer.diskStorage({
    destination: '../inter-donation-back/public/images',
    filename : (req,file , cb)=>{
        return cb (null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
     }
})
  
const upload = multer({
    storage :storage,
    limits : {fileSize:300000000}
})

router.get('/affichePosts', postController.affichePosts);

router.get('/nbrOfPosts', postController.nbrOfPosts);

router.get('/nbrLikes', postController.nbrLikes);

router.get('/nbrComments', postController.nbrComments);

router.get('/affichePostsById/:id', postController.affichePostsById);

router.post('/addPost',upload.single('PostImage'), postController.addPost);

router.delete('/deletePost/:id', postController.deletePost);

router.put('/updatePost/:id',upload.single('PostImage'), postController.updatePost);

router.put('/likePost/:id', postController.likePost);

router.put('/unlikePost/:id', postController.unlikePost);

router.post('/addComment/:id', postController.addComment);

router.get('/afficheListLikes/:id', postController.afficheListLikes);

router.get('/afficheListComments/:id', postController.afficheListComments);

router.get('/afficheTousComments', postController.afficheTousComments);

//router.get('/afficheMostPost',postController.afficheMostPost);

module.exports = router;