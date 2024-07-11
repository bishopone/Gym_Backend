const productService = require('../services/productService');
exports.createProduct = async (req, res) => {
    try {
        const userId = req.user.id ; 
        const product = await productService.createProduct(req.body, userId);
        res.status(201).json(product);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
};

exports.getProduct = async (req, res) => {
    try {
        const product = await productService.getProduct(req.params.id);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const { productType, priceRange, name, page = 1, limit = 30 } = req.query;
        const filter = {};

        if (productType) filter.productType = productType;
        if (priceRange) {
            const [min, max] = priceRange.split('-').map(Number);
            filter.price = { $gte: min, $lte: max };
        }
        if (name) filter.name = new RegExp(name, 'i'); // case-insensitive regex search

        const products = await productService.getAllProducts(filter, page, limit);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
