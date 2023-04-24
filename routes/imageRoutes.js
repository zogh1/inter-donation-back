const express = require('express');
const router = express.Router();
const Image = require('../models/image.model');
const Event = require('../models/event.model');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../../INTER_DON/inter-donation/public/event/'); 
  },
  filename: (req, file, cb) => {
    if (file) {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
      cb(null, uniqueSuffix);
    } else {
      cb(new Error('No file specified'));
    }
  },
});

const upload = multer({ storage });

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const  eventId   = req.body.event;
  
    const image = req.file.filename; 

    const event = await Event.findById(eventId);
  

    if (!event) {
      return res.status(400).json({ error: 'Event not found' });
    }
    const newImage = new Image({
      image,
      event,
    });
    const savedImage = await newImage.save();
    res.status(201).json(savedImage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const images = await Image.find().populate('event', '_id title');
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const eventId  = req.body.event;
    
    const image = req.file.filename;
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(400).json({ error: 'Event not found' });
    }
    console.log('id:'+ req.params.id,);
    console.log('id:'+ image,);
    console.log('id:'+ event,);

    const updatedImage = await Image.findByIdAndUpdate(
      req.params.id,
      { image, event },
      { new: true }
    );
    res.json(updatedImage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Image.findByIdAndDelete(req.params.id);
    res.json({ message: 'Image supprimée avec succès!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  const eventId = req.params.id;
  try {
    const images = await Image.find({ event: eventId });
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/img/:id', async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const images = await Image.findById(id);
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
