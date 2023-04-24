const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  image: { type: String, maxlength: 250  },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' }, // Relation plusieurs-un-à avec la table "Event"
});


const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
