const userSubscriptionService = require('../services/userSubscriptionService');

exports.createUserSubscription = async (req, res) => {
  try {
    const userSubscriptionData = req.body;
    const userSubscription = await userSubscriptionService.createUserSubscription(userSubscriptionData);
    res.status(201).json(userSubscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserSubscriptions = async (req, res) => {
  try {
    const { userId } = req.params;
    const userSubscriptions = await userSubscriptionService.getUserSubscriptions(userId);
    res.status(200).json(userSubscriptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUserSubscriptions = async (req, res) => {
    try {
      const userSubscriptions = await userSubscriptionService.getAllUserSubscriptions();
      res.status(200).json(userSubscriptions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };