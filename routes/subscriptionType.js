const express = require('express');
const router = express.Router();
const subscriptionTypeController = require('../controllers/subscriptionTypeController');

router.post('/', subscriptionTypeController.createSubscriptionType);
router.get('/', subscriptionTypeController.getAllSubscriptionTypes);
router.get('/:id', subscriptionTypeController.getSubscriptionTypesById);
router.put('/:id', subscriptionTypeController.updateSubscriptionTypesById);
router.delete('/:id', subscriptionTypeController.deleteSubscriptionTypesById);

module.exports = router;
