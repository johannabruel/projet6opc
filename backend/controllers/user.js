const bcrypt = require('bcrypt'); // Package pour le chiffrement
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Pour la sécurité 
const dotenv = require('dotenv').config(); // Variable d'environnement
const cryptoJs = require('crypto-js'); // Chiffrement de l'email dans la base de donnée

// Fonction pour enregistrer les nouveaux utilisateurs
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email:cryptoJs.HmacSHA256(req.body.email, process.env.CRYPTOJS_EMAIL_KEY).toString(), // Cryptage de l'email
                password: hash
            });
        user.save()
            .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
            .catch(error => res.status(400).json({error}));
    })
    .catch(error => res.status(500).json({ error }));
    
};

// Fonction pour connecter des utilisateurs existants
exports.login = (req, res, next) => {
    // Constante pour rechercher l'email crypté 
    const cryptoSearchEmail = cryptoJs.HmacSHA256(req.body.email, process.env.CRYPTOJS_EMAIL_KEY).toString();
    
    User.findOne({email: cryptoSearchEmail})
    .then(user => {
        if(!user){
            return res.status(401).json({ error: 'Paire identifiant/mot de passe incorrecte'});
        } else {
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if(!valid){
                    return res.status(401).json({ error: 'Paire identifiant/mot de passe incorrecte'});
                } else {
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            {userId: user._id},
                            process.env.JWT_SECRET_TOKEN_KEY, // MODIFICATION ICI
                            { expiresIn: '24h'}
                        )
                    });
                }
            })
            .catch(error => {
                res.status(500).json({error});
            })
        }
    })
    .catch(error => {
        res.status(500).json({error});
    })
};
