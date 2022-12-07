const mongoose = require('mongoose');

// Création d 'un schéma de données qui contient les champs souhaités
const sauceSchema = mongoose.Schema({
    name: { type: String, required: true},
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String },
    heat: { type: Number, required: true },
    likes: { type: Number, default: 0},
    dislikes: { type: Number, default: 0 },
    userId: { type: String },
    usersLiked: [String],
    usersDisliked: [String],
});

// Exporte le schéma en tant que modèle Mongoose appelé "Sauce" pour le rendre disponible pour Express
module.exports = mongoose.model('Sauce', sauceSchema);