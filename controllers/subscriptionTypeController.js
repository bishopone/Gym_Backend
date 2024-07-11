const subscriptionTypeService = require('../services/subscriptionTypeService');

exports.createSubscriptionType = async (req, res) => {
  try {
    const subscriptionTypeData = req.body;
    const subscriptionType = await subscriptionTypeService.createSubscriptionType(subscriptionTypeData, req.user);
    res.status(201).json(subscriptionType);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
};

exports.getAllSubscriptionTypes = async (req, res) => {
  try {
    const subscriptionTypes = await subscriptionTypeService.getAllSubscriptionTypes(req);
    res.status(200).json(subscriptionTypes);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
};
exports.getSubscriptionTypesById = async (req, res) => {
  try {
    const id = req.params.id
    const subscriptionTypes = await subscriptionTypeService.getSubscriptionTypesById(id);
    res.status(200).json(subscriptionTypes);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
};

exports.updateSubscriptionTypesById = async (req, res) => {
  try {
    const id = req.params.id
    console.log(id, req.body)
    const subscriptionTypes = await subscriptionTypeService.updateSubscriptionTypesById(id, req.body);
    res.status(200).json(subscriptionTypes);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
};



exports.deleteSubscriptionTypesById = async (req, res) => {
  try {
    const id = req.params.id
    console.log(id, req.body)
    const subscriptionTypes = await subscriptionTypeService.deleteSubscriptionTypesById(id);
    res.status(200).json(subscriptionTypes);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
};
