// userMetricsController.js
const {
    upsertUserMetrics,
    getUserMetrics,
    trackAttendance,
    getUserAttendance,
    countUserGymVisits,
  } = require('../services/userMetricsService');
  
  const handleUpsertUserMetrics = async (req, res) => {
    const { userId, height, weight } = req.body;
    try {
      const result = await upsertUserMetrics(userId, height, weight);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  const handleGetUserMetrics = async (req, res) => {
    const { userId } = req.params;
    try {
      const result = await getUserMetrics(userId);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  const handleTrackAttendance = async (req, res) => {
    const { userId, checkInTime, checkOutTime } = req.body;
    try {
      const result = await trackAttendance(userId, checkInTime, checkOutTime);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  const handleCountUserGymVisits = async (req, res) => {
    const { userId, startDate, endDate } = req.query;
    try {
      const result = await countUserGymVisits(userId, startDate, endDate);
      res.status(200).json({ count: result });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  module.exports = {
    handleUpsertUserMetrics,
    handleGetUserMetrics,
    handleTrackAttendance,
    handleCountUserGymVisits,
  };
  