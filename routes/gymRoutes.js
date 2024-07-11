const express = require('express');
const router = express.Router();
const gymController = require('../controllers/gymController');


router.post('/register', gymController.createGym);
router.put('/:id', gymController.editGym);
router.get('/', gymController.getGyms);
router.get('/:id', gymController.getGymById);
router.put('/status/:id', gymController.updateGymStatusById);
router.delete('/:id', gymController.deleteGymById);

module.exports = router;
