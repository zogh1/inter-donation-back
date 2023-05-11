const express = require('express');
const router = express.Router();
const Event = require('../models/event.model');
const multer = require('multer');
const path = require('path');
const SousCategorie = require('../models/sousCategorie.model');
const mongoose = require('mongoose');


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
router.post('/', upload.single('imageEvent'),async (req, res) => {
  try {
    const { nomEvent, descriptionEvent,sousCategorie,locationEvent,dateEvent,dateEventFin  } = req.body;
    if (!nomEvent || !descriptionEvent || !sousCategorie || !locationEvent || !dateEvent || !dateEventFin) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    const imageEvent = req.file.filename; 


    const existingSousCategorie = await SousCategorie.findById(sousCategorie);
    console.log(existingSousCategorie);
    if (!existingSousCategorie) {
      return res.status(400).json({ success: false, message: 'Invalid sousCategorie' });
    }
    await Event.create({
        nomEvent,
        descriptionEvent,
        sousCategorie,
        locationEvent,dateEvent,dateEventFin,
      // sousCategorie,
        imageEvent,
      });
  
      res.status(201).json({ success: true, message: 'Événement ajouté avec succès' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Une erreur est survenue lors de l\'ajout de l\'événement' });
    }
  });

// Récupération de tous les événements
router.get('/all', async (req, res) => {
  try {
   

    const page = parseInt(req.query.page) || 1; 
    const perPage = 20;
    const sortOption = req.query.sort === 'asc' ? { nomEvent: 1 } : { nomEvent: -1 };

    const skip = (page - 1) * perPage; 
    const searchQuery = req.query.searchQuery;
    const sousCategorie = req.query.subCategory; 

  const filter = searchQuery ? {
    $or: [
      { nomEvent: { $regex: searchQuery, $options: 'i' } },
      { descriptionEvent: { $regex: searchQuery, $options: 'i' } },
    ],
  } : {};

  if (sousCategorie){

    filter.sousCategorie = sousCategorie;
  }
 
  const totalEvents = await Event.countDocuments(filter);
  const totalPages = Math.ceil(totalEvents / perPage);

  const events = await Event.find(filter)
  .populate([{path:'sousCategorie', model:"SousCategorie"}])
    .sort(sortOption)
    .skip(skip)
    .limit(perPage);

    res.json({ events, totalPages, currentPage: page });
} catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Server error' });
}
});




router.put('/:id', upload.single('imageEvent'), async (req, res) => {
  try {
    const { id } = req.params;
    const { nomEvent,dateEvent,dateEventFin,locationEvent, descriptionEvent, sousCategorie } = req.body;
    if (!nomEvent || !descriptionEvent || !sousCategorie || !locationEvent || !dateEvent || !dateEventFin) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    const imageEvent = req.file?.filename;
console.log('id sous cat'+ req.body.sousCategorie);
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    console.log('event sous cat'+ event.sousCategorie);

    event.nomEvent = nomEvent || event.nomEvent;
    event.descriptionEvent = descriptionEvent || event.descriptionEvent;
    event.dateEvent = dateEvent || event.dateEvent;
    event.dateEventFin = dateEventFin || event.dateEventFin;

    event.locationEvent = locationEvent || event.locationEvent;

    
    event.sousCategorie = sousCategorie || event.sousCategorie;
    event.imageEvent = imageEvent || event.imageEvent;

    const updatedEvent = await event.save();

    res.json(updatedEvent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id; // Convertir en entier
console.log(id);
    await Event.findByIdAndDelete(id);

    res.json({ message: 'Événement supprimé avec succès!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
console.log(id);
const event = await Event.findById(id);

if (!event) {
  return res.status(404).send('Event not found');
}
    res.json( event );
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


router.get('/events/:sousCategorieId', async (req, res) => {
  try {
    const { sousCategorieId  } = req.params;
    const currentDate = new Date(); // Get the current local date

    const events = await Event.find({ sousCategorie: sousCategorieId,
    
    
      dateEventFin: { $gt: currentDate }
    }).limit(2);


    
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching events.' });
  }
});

module.exports = router;
