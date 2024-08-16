const express = require('express');
const secretCodeController = require('../controllers/secretCodeController');

const router = express.Router();

router.post('/assign', secretCodeController.assignCardToUser);
router.post('/reassign', secretCodeController.reassignCardToUser);
router.get('/user/:cardId', secretCodeController.getUserByCardId);
router.get('/generate-ids/:count', secretCodeController.generateUniqueIds);
router.post('/remove', secretCodeController.removeCardFromUser);

module.exports = router;
