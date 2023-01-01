const express = require('express');
const router = express.Router(); // Importe le routeur

const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const validate = require('../middleware/inputs-validator');

router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.post('/', auth, multer, validate.sauce, sauceCtrl.createSauce);
router.put('/:id', auth, multer, validate.sauce, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, validate.like, sauceCtrl.likeSauce);

module.exports = router;