const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Variable d'environnement
const dotenv = require('dotenv').config();

// Sécurité 
const helmet = require('helmet'); // Pour sécuriser les headers
const morgan = require('morgan'); // Pour les logs des requêtes

// Routes
const saucesRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

// Intégration express
const app = express();

//Mongoose connection
mongoose.connect(process.env.MONGODB_CONNECT,
    { useNewUrlParser: true,
    useUnifiedTopology: true 
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

// CORS - Middleware qui permet à l'application d'accéder API
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.ORIGIN_FRONT); // Permet accéder API depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // Permet d'ajouter les headers mentionnés aux requêtes envoyées vers l'API
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Permet d'envoyer des requetes avec les méthodes mentionnées
    next();
  });

// Pour sécuriser les headers - bloquer tentative utilisation XSS
app.use(helmet.xssFilter());

// Pour stocker les logs des requêtes dans un fichier "request.log"
const requestLog = fs.createWriteStream(path.join(__dirname, 'request.log'), { flags: 'a'});
app.use(morgan('combined', {stream: requestLog}));

// ROUTES
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes); 
app.use('/images', express.static(path.join(__dirname, 'images'))); // Gestion des images de manière static

// Export de l'application
module.exports = app;