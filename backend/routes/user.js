const express = require('express'); // Création routeur Express
const router = express.Router();

const userCtrl = require('../controllers/user');

// Routes POST pour créer un compte ou se connecter
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;