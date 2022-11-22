const express = require('express');
const mongoose = require('mongoose');
const app = express();

//Mongoose connection
mongoose.connect('mongodb+srv://user1:mdp123@cluster0.sfrfsda.mongodb.net/?retryWrites=true&w=majority',
    { useNewUrlParser: true,
    useUnifiedTopology: true 
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// Express
app.use((req, res) => {
   res.json({ message: 'Votre requête a bien été reçue !' }); 
});

module.exports = app;