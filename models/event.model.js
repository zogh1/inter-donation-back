const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  nomEvent: { type: String, required: true, maxlength: 75 },
  descriptionEvent: { type: String, required: true },
  imageEvent: { type: String, maxlength: 250 },
  dateEvent:{ type : Date, required:true},
  dateEventFin:{ type : Date, required:true},
  locationEvent:{ type : String, required:true, maxlength: 100 },

  sousCategorie: { type: mongoose.Schema.Types.ObjectId, ref: 'SousCategorie' }, // Relation plusieurs-un-à avec la table "SousCategorie"
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }]
});


const Event = mongoose.model('Event', eventSchema);

module.exports = Event;


