const express = require('express');
const router = express.Router();
const userSubscriptionController = require('../controllers/userSubscriptionController');

router.post('/', userSubscriptionController.createUserSubscription);
router.get('/:userId', userSubscriptionController.getUserSubscriptions);
router.get('/', userSubscriptionController.getAllUserSubscriptions);

module.exports = router;
