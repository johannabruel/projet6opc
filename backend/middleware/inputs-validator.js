// Pour valider les données saisies par les utilisateurs
const Joi = require('joi'); 

// Validation des données lors de l'inscription de l'utilisateur
const userSchema = Joi.object({
    email: Joi.string()
        .trim()
        .email()
        .required(),
    password: Joi.string()
        .alphanum() // Uniquement chaine qui contient des lettres et des chiffres
        .pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{5,}$/) // Au moins 5 caractères, au moins une majuscule, au moins une minuscule, au moins un chiffre
        .required()
});

exports.user = (req, res, next) => {
    const {error, value} = userSchema.validate(req.body);
    if (error) {
        return res.status(401).json({ error: "Email ou mot de passe invalide (besoin mot de passe de 5 caractères minimum dont 1 majuscule, sans caractère spécial)"});
    } else {
        next();
    }
};


// Validation des données lors de la création ou modification d'une sauce
const sauceSchema = Joi.object({
    userId: Joi.string()
        .trim()
        .required(),

    name: Joi.string()
        .trim()
        .min(1)
        .pattern(/^[a-zA-Z0-9 _.,?!&()'éèêëàôù]+$/)
        .required(),

    manufacturer: Joi.string()
        .trim()
        .min(1)
        .pattern(/^[a-zA-Z0-9 _.,?!&()'éèêëàôù]+$/)
        .required(),

    description:Joi.string()
        .trim()
        .min(1)
        .pattern(/^[a-zA-Z0-9 _.,?!&()'éèêëàôù]+$/)
        .required(),

    mainPepper:Joi.string()
        .trim()
        .min(1)
        .pattern(/^[a-zA-Z0-9 _.,?!&()'éèêëàôù]+$/)
        .required(),

    heat:Joi.number()
        .integer()
        .min(1)
        .max(10)
        .required()
});

exports.sauce = (req, res, next) => {
    let sauce; 
    if(req.file){
        sauce = JSON.parse(req.body.sauce)
    } else {
        sauce = req.body;
    }

    const {error, value}= sauceSchema.validate(sauce);
    if(error){
        return res.status(500).json({error: "Des caracrères saisies ne sont pas autorisés"})
    }
    else{
        next()
    }
};

// Validation des saisies pour like et dislike
const likeSchema = Joi.object({
    userId: Joi.string()
        .trim()
        .required(),
    like: Joi.valid(-1, 0, 1)
        .required()
});

exports.like = (req, res, next) => {
    const {error, value} = likeSchema.validate(req.body);
    if(error) {
        return res.status(500).json({error: "Des caracrères saisies ne sont pas autorisés"});
    } else {
        next();
    }
}

