const subscriptionService = require('../services/subscriptionService');

exports.createSubscription = async (req, res) => {
  try {
    const subscription = await subscriptionService.createSubscriptionService(req.body);
    res.status(201).json(subscription);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
};

exports.getUserSubscriptionDaysLeft = async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await subscriptionService.getUserSubscriptionDaysLeft(userId);
    if (!data) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserSubscription = async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await subscriptionService.getUserSubscription(userId);
    if (!data) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    res.status(200).json(data);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
};
