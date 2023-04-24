const express = require('express');
const router = express.Router();
const SousCategorie = require('../models/sousCategorie.model');

router.post('/', async (req, res) => {
  try {
    const newSousCategorie = new SousCategorie(req.body);
    const savedSousCategorie = await newSousCategorie.save();
    res.status(201).json(savedSousCategorie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const sousCategories = await SousCategorie.find();
    res.json(sousCategories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const sousCategories = await SousCategorie.findById(id);
    res.json(sousCategories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedSousCategorie = await SousCategorie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedSousCategorie);
  } catch (err) {
    res.status(500).json({ error: err.message });
}
});

router.delete('/:id', async (req, res) => {
try {
    const id = req.params.id; // Convertir en entier

await SousCategorie.findOneAndDelete(id);
res.json({ message: 'Sous-catégorie supprimée avec succès!' });
} catch (err) {
res.status(500).json({ error: err.message });
}
});

module.exports = router;