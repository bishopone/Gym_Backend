const express = require('express');
const subscriptionController = require('../controllers/subscriptionController');
const router = express.Router();

router.post('/', subscriptionController.createSubscription);
router.get('/:userId', subscriptionController.getUserSubscription);
router.delete('/:id', subscriptionController.deleteUserSubscription);
router.get('/days-left/:userId', subscriptionController.getUserSubscriptionDaysLeft);

module.exports = router;
