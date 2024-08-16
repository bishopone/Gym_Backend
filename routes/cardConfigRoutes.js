// routes/cardConfig.js

const express = require('express');
const router = express.Router();
const cardConfigController = require('../controllers/cardConfigController');

router.post('/save', cardConfigController.saveCardConfig);
router.get('/gym', cardConfigController.fetchCardConfigs);
router.get('/active', cardConfigController.fetchActiveCardConfig);
router.put('/update/:id', cardConfigController.updateCardConfig);
router.put('/active/:id', cardConfigController.makeCardActive);
router.delete('/:id', cardConfigController.deleteCardConfig);
router.post('/upload', cardConfigController.uploadImage);

module.exports = router;
