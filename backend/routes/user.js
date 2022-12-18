const express = require('express'); // Création routeur Express
const router = express.Router();

const userCtrl = require('../controllers/user');
const validate = require('../middleware/inputs-validator');


// Routes POST pour créer un compte ou se connecter
router.post('/signup', validate.user, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;