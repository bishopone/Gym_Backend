const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

router.post('/start-transaction', transactionController.startTransaction);
router.post('/complete-transaction', transactionController.completeTransaction);
router.get('/', transactionController.allTransactions);

module.exports = router;
