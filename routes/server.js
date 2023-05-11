// Importation des dépendances
const express = require('express');
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);

const cors = require('cors');
const eventRoutes = require('./routes/eventRoutes');
const sousCategorieRoutes = require('./routes/sousCategorieRoutes');
const postRt = require('./routes/postRoutes');

const videoRoutes = require('./routes/videoRoutes');
const imageRoutes = require('./routes/imageRoutes');
// Configuration de l'application Express
const app = express();
const PORT = process.env.PORT || 5000; // Port d'écoute du serveur

// Utilisation de Cors pour autoriser les requêtes provenant d'autres domaines
app.use(cors());

// Configuration du parsing des requêtes en JSON
app.use(express.json());

// Connexion à la base de données MongoDB
mongoose.connect('mongodb://localhost:27017/mern-event-app', { useNewUrlParser: true, useUnifiedTopology: true,  useFindAndModify: false  })
 /* .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur de connexion à MongoDB:', err));
  //const connection = mongoose.connection;*/

  mongoose.connection.on('error', (err) => {
    console.error('Erreur de connexion à MongoDB:', err);
  });
  
  // Gestionnaire d'événement pour l'événement "open" lors de la connexion
  mongoose.connection.once('open', () => {
    console.log('Connecté à MongoDB');
  })

// Utilisation des routes pour chaque table
app.use('/events', eventRoutes);
app.use('/souscategories', sousCategorieRoutes);
app.use('/videos', videoRoutes);
app.use('/images', imageRoutes);
app.use('/postub', postRt);


// Lancement du serveur
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));










