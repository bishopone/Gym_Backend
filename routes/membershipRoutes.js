const express = require('express');
const router = express.Router();
const membershipController = require('../controllers/membershipController');

router.post('/create', membershipController.createMembership);
router.put('/update', membershipController.updateMembership);
router.delete('/delete', membershipController.deleteMembership);

module.exports = router;
