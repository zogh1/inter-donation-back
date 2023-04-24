const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  urlVid: { type: String, required: true, maxlength: 250 },
  typeVid :{ type: String, required: true},
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' }, // Relation plusieurs-un-à avec la table "Event"
});

const Video = mongoose.model('Video', videoSchema);


module.exports = Video;
