const mongoose = require('mongoose');

const sousCategorieSchema = new mongoose.Schema({
  nomSousCat: { type: String, required: true, maxlength: 30 },
  event: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }]

});


const SousCategorie = mongoose.model('SousCategorie', sousCategorieSchema);

module.exports = SousCategorie;
