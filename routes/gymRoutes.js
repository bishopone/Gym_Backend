const express = require('express');
const router = express.Router();
const gymController = require('../controllers/gymController');
const multer = require('multer');
const upload = multer();

router.post('/register',upload.single('logo'), gymController.createGym);
router.put('/:id',upload.single('logo'), gymController.editGym);
router.get('/', gymController.getGyms);
router.get('/:id', gymController.getGymById);
router.put('/status/:id', gymController.updateGymStatusById);
router.delete('/:id', gymController.deleteGymById);

module.exports = router;
