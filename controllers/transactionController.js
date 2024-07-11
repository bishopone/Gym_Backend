const transactionService = require('../services/transactionService');

exports.startTransaction = async (req, res) => {
    const body= req.body;
    try {
        const result = await transactionService.startTransaction(body);
        res.status(200).json(result);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
};

exports.completeTransaction = async (req, res) => {
    const { transactionId } = req.body;
    try {
        const result = await transactionService.completeTransaction(transactionId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
