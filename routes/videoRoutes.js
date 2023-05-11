

const express = require('express');
const router = express.Router();
const Video = require('../models/video.model');
// houni

router.post('/', async (req, res) => {
  try {
    const newVideo = new Video(req.body);
    const savedVideo = await newVideo.save();
    res.status(201).json(savedVideo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const videos = await Video.find();
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedVideo = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedVideo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Video.findByIdAndDelete(req.params.id);
    res.json({ message: 'Vidéo supprimée avec succès!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/:id', async (req, res) => {
  const eventId = req.params.id;
  try {
    const video = await Video.find({ event: eventId });
    res.json(video);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/vid/:id', async (req, res) => {
  const Id = req.params.id;
  try {
    const video = await Video.findById(Id);
    res.json(video);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
