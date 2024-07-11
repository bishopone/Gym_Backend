const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const {validateToken} = require('../middleware/auth');

// Define routes
router.post('/create',[validateToken],productController.createProduct);
router.get('/:id', [validateToken],productController.getProduct);
router.get('/', productController.getAllProducts);

module.exports = router;
