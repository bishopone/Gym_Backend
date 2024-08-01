const transactionService = require("../services/transactionService");

exports.startTransaction = async (req, res) => {
  const body = req.body;
  try {
    const result = await transactionService.startTransaction(body);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

exports.completeTransaction = async (req, res) => {
  const { transactionId } = req.body;
  try {
    const result = await transactionService.completeTransaction(transactionId);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: error.message });
  }
};

exports.allTransactions = async (req, res) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      startDate,
      endDate,
      userId,
      status,
    } = req.query;
    const result = await transactionService.allTransactions({
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      startDate,
      endDate,
      userId,
      status,
    });
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
