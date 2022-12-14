const Sauce = require('../models/sauce'); //Import du modèle Sauce
const fs = require('fs');

// Fonction pour la création de la sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id; // Supprime champ id de l'objet (généré automatiquement pas BD)
    delete sauceObject._userId; // Supprimer champ userId (pour utiliser userID du Token d'authentification)
    
    const sauce = new Sauce ({ //Création objet 
        ...sauceObject,
        userId: req.auth.userId, // Extrait le userID de la requête
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.likes = 0;
    sauce.dislikes = 0;

    sauce.save()
    .then(() => {res.status(201).json({ message: 'Sauce enregistrée !'})})
    .catch(error => {res.status(400).json({error})});
};

// Fonction pour supprimer la sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id}) // Récupère objet 
    .then(sauce => {
        if (sauce.userId != req.auth.userId){ // Vérifie propriétaire objet qui demande sa suppression
            res.status(401).json({message: 'Non-autorisé'})
        } else {
            const filename = sauce.imageUrl.split('/images/')[1]; //Récupère URL enregistré
            fs.unlink(`images/${filename}`, () => { //Méthode unlink de fs (permet modifier le système de fichiers)
                Sauce.deleteOne({_id: req.params.id}) // Supprime enregistrement dans BD
                    .then(() => {res.status(200).json({message: 'Sauce supprimée !'})})
                    .catch(error => res.status(401).json({ error }));
            });
        }
    })
    .catch( error => {res.status(500).json({ error })})
};

// Fonction pour afficher toutes les sauces de la BD
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then((sauces) => {res.status(200).json(sauces)})
    .catch((error) => {res.status(400).json({error: error})});
};

// Fonction pour afficher une sauce en particulier
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then((sauce) => {res.status(200).json(sauce)})
    .catch((error) => {res.status(404).json({error: error})});
};

// Fonction pour modifier la sauce
//Si utilisateur a modifié le fichier image, le format de la requête ne sera pas le même
exports.modifySauce = (req, res, next) => { 
    
    if (req.file) { // Si image est modifiée, supprime l'image présente dans dossier image du backend
        Sauce.findOne({_id: req.params.id}) 
            .then(sauce => {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    const sauceObject = {
                        ...JSON.parse(req.body.sauce), // Récupère objet en Parsent la chaine de caractère
                        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // Et en recréant URL de l'image
                    } 
                    delete sauceObject._userId; // Supprime UserID venant de la requête (mesure sécurité)

                    if(sauce.userId != req.auth.userId){
                        res.status(403).json({ message: 'Non-autorisé'});
                    } else {
                        Sauce.updateOne({ _id: req.params.id}, {...sauceObject, _id:req.params.id})
                        .then(() => res.status(200).json({message: 'Sauce modifiée !'}))
                        .catch(error => res.status(401).json({ error }));
                    }
                })
            })
        .catch(error => res.status(500).json({error}));
        
    } else { // Si l'image n'est pas modifiée
        const sauceObject = { ...req.body};
        delete sauceObject._userId; // Supprime UserID venant de la requête (mesure sécurité)
        
        Sauce.findOne({_id: req.params.id}) // Cherche objet dans BD
        .then((sauce) => {
            if(sauce.userId != req.auth.userId){
                res.status(403).json({ message: 'Non-autorisé'});
            } else {
                Sauce.updateOne({ _id: req.params.id}, {...sauceObject, _id:req.params.id})
                .then(() => res.status(200).json({message: 'Sauce modifiée !'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error)=> {res.status(400).json({ error });
        });
    }
};

// Fonction pour liker ou disliker 
exports.likeSauce = (req, res, next) => {
    const like = req.body.like;
    // Si clic sur bouton like 
    if (like === 1){
        Sauce.updateOne(
            { _id: req.params.id},
            { $inc: { likes: 1}, $push: { usersLiked: req.body.userId}}
        )
        .then((sauce)=> res.status(200).json({message:'Votre Like a été ajouté !'}))
        .catch((error)=> res.status(400).json({ error }))
    }
    else if(like === -1) {
        Sauce.updateOne(
            { _id: req.params.id},
            { $inc: { dislikes: 1}, $push: {usersDisliked: req.body.userId}}
        )
        .then((sauce)=> res.status(200).json({message:'Votre Dislike a été ajouté !'}))
        .catch((error)=> res.status(400).json({ error }))
    }
    else {
        Sauce.findOne({ _id: req.params.id}) // Récupère objet 
            .then(sauce => {
                if(sauce.usersLiked.includes(req.body.userId)){
                    Sauce.updateOne(
                        { _id: req.params.id}, 
                        { $inc: { likes: -1}, $pull: {usersLiked: req.body.userId}}
                    )
                    .then((sauce)=> { res.status(200).json({ message:'Votre like a été supprimé !'})})
                    .catch((error)=> res.status(400).json({ error }))
                }
                else if(sauce.usersDisliked.includes(req.body.userId)){
                    Sauce.updateOne(
                        { _id: req.params.id}, 
                        { $inc: { dislikes: -1}, $pull: { usersDisliked: req.body.userId}}
                    )
                    .then((sauce)=> { res.status(200).json({ message:'Votre dislike a été supprimé !'})})
                    .catch((error)=> res.status(400).json({ error }))
                }
            })
            .catch(error=> res.status(400).json({ error }))
    }
}