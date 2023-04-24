const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');

router.get('/popular-posts', async (req, res) => {
  try {
    const popularPosts = await Post.aggregate([
      // Match only posts that have at least one like
      { $match: { likes: { $exists: true, $not: { $size: 0 } } } },
      // Add a new field to the document that contains the total number of likes
      { $addFields: { totalLikes: { $size: '$likes' } } },
      // Sort the documents by the total number of likes in descending order
      { $sort: { totalLikes: -1 } },
      // Limit the results to 3 documents
      { $limit: 3 },
      // Populate the 'user' field with the corresponding user document
      { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      // Select only the fields that we want to return to the client
      { $project: { _id: 1, text: 1, subject: 1, PostImage: 1, totalLikes: 1, 'user.firstName': 1, 'user.lastName': 1 } }
    ]);
    res.json(popularPosts);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});



router.post('/', async (req, res) =>{
    const p = new Post({
        user: req.body.user,
        text: req.body.text,
        subject : req.body.subject,
        likes : req.body.likes,
    });
    var post =p.save();
    res.json(post);
});


router.post('/user', async (req, res) =>{
    const { lastName, email, password, firstName, imageUrl,role ,faceId} = req.body;
  console.log(lastName, email, password, firstName, imageUrl,role );
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({
        success: false,
        message: 'An account with that email already exists',
      });
    }
    await User.create({
        lastName, email, password, firstName, imageUrl,role ,faceId
      });
    res.status(201).json({ success: true, message: 'Événement ajouté avec succès' });
}catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/u', async (req, res) => {
    try {
      const u = await User.find();
      res.json(u);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
module.exports = router;