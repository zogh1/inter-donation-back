var Post = require('../models/post');
const User = require("../models/user");

const { response } = require('express');
const e = require('express');
const _ = require('lodash');



exports.nbrLikes= async(req,res)=>{
    Post.aggregate([
        { $unwind: '$likes' }, 
        { $group: { _id: null, count: { $sum: 1 } } }, 
        { $project: { _id: 0, count: 1 } }
    ])
        .then(results => {
        const numLikes = results.length > 0 ? results[0].count : 0;
        console.log(`There are ${numLikes} likes across all posts`);
        res.json(numLikes);
        })
        .catch(error => {
        console.error(`Error fetching total likes: ${error.message}`);
        });
}


exports.nbrComments= async(req,res)=>{
    Post.aggregate([
        { $unwind: '$comments' }, 
        { $group: { _id: null, count: { $sum: 1 } } }, 
        { $project: { _id: 0, count: 1 } }
    ])
        .then(results => {
        const numComments = results.length > 0 ? results[0].count : 0;
        console.log(`There are ${numComments} comments across all posts`);
        res.json(numComments);
        })
        .catch(error => {
        console.error(`Error fetching total comments: ${error.message}`);
        });
}

exports.nbrOfPosts=async(req, res)=>{
    Post.countDocuments({}, function (error, count) {
        if (error) {
          console.log(error);
        } else {
          console.log('Number of posts:', count);
        }
    });
}

// get 
exports.affichePosts=async(req, res)=>{

   const p= Post.find()
   .then(response=>{return res.json(response)})
   .catch(e=>res.json(e), console.log(e))
    };   
;

// get by id
exports.affichePostsById=async(req, res)=>{

    var id =req.params.id;
    const post= await Post.findById(id)
    .then(response=>{return res.json(response)})
    .catch(e=>res.json(e), console.log(e))
};   


// add 
exports.addPost=async(req, res)=>{
    const p = new Post({
        user: req.body.user,
        PostImage :'/images/'+ req.file.filename,
        text: req.body.text,
        subject : req.body.subject,
        likes : req.body.likes,
    });
    var post =p.save();
    res.json(post);
};


// delete 
exports.deletePost=async(req, res)=>{
    var ident = req.params.id;
    Post.findOneAndRemove({_id:ident},function (err) {
        if(err) return res.status(404).json({msg : 'post not Found '});
    });
res.redirect('/post/')
};

// update 
exports.updatePost=async(req, res)=>{
    var id =req.params.id;
    Post.findById({_id:id},(err,data)=>{
        data.subject = req.body.subject;
        data.text = req.body.text;
        data.PostImage='/images/'+ req.file.filename;
        data.save();
    });
    res.redirect('/post/');
};

// like a post
exports.likePost=async(req, res)=>{
    try {
        var id =req.params.id;
        const post= await Post.findById(id);
        console.log(post.likes);
       console.log("aa",req.body);
       const u = await User.findOne({_id:req.body.user});
        
        if (post.likes.filter(e=>e._id==req.body.user).length>0)
            {
                 return res.status(400).json({msg:'post already liked'});
            }
        //console.log(req.body.user);  
        console.log(u) ;
        const aa =await Post.updateOne({_id:id},{$addToSet:{likes:u}},{new:true})
        // console.log(aa);         
        //  post.likes.unshift({u});
        //  await post.save();
        res.json(post);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('server error');    
    }
}

// unlike a post
exports.unlikePost=async(req, res)=>{
    try {
        var id =req.params.id;
        const post=await Post.findById(id);
        console.log(post.likes);

        const u = await User.findOne({_id:req.body.user})  ;

         if (
             post.likes.filter(e=>e._id==req.body.user).length==0
         ){
             return res.status(400).json({msg:"post has not yet been liked"});
         }
        console.log(u) ;
        const aa = await Post.updateOne({_id: id}, {$pull: {likes: u}}).then(response => {
            console.log(response);
          });
        // const removeIndex = post.likes
        //     .map(e=e._id)
        //     .indexOf(req.body.user)
        // ;
        // post.likes.splice(removeIndex,1) 

        // post.likes.pull(likes,removeIndex);
        // await post.save();
        res.json(post.likes);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('server error');    
    }
}

// add comment a post
exports.addComment=async(req, res)=>{
    try {
        const user = await User.findOne({_id:req.body.user})  ;

        var id =req.params.id;
        const post=await Post.findById(id);
        console.log(post);

        const newComment={
            user: user,
            text : req.body.text,

        };

        const aa = await Post.updateOne({_id: id}, {$addToSet: {comments: newComment}}).then(response => {
            console.log(response);
          });

          await post.save();
        res.json(post.comments);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('server error');    
    }
}


exports.afficheListLikes=async(req,res)=>{
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId).populate('likes', 'username');
        res.json(post.likes);
      } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
      }
}

exports.afficheListComments=async(req,res)=>{
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId).populate('comments', 'username');
        res.json(post.comments);
      } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
      }
}

exports.afficheTousComments = async(req,res)=>{
    try {
        const allComments = [];
        const posts = await Post.find();
        posts.forEach((post) => {
          post.comments.forEach((comment) => {
            allComments.push(comment);
          });
        });
        res.json(allComments);
        console.log(allComments.length);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}