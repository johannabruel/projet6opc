const express = require('express');
const mongoose = require('mongoose');

const saucesRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
const path = require('path');
const app = express();

//Mongoose connection
mongoose.connect('mongodb+srv://user1:mdp123@cluster0.sfrfsda.mongodb.net/?retryWrites=true&w=majority',
    { useNewUrlParser: true,
    useUnifiedTopology: true 
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json()); // Anciennement BodyParser

// CORS - Middleware qui permet à l'application d'accéder API
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Permet accéder API depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // Permet d'ajouter les headers mentionnés aux requêtes envoyées vers l'API
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Permet d'envoyer des requetes avec les méthodes mentionnées
    next();
  });
  

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes); 
app.use('/images', express.static(path.join(__dirname, 'images')));


// Export de l'application
module.exports = app;