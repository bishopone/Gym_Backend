const attendanceService = require('../services/attendanceService');

exports.createAttendance = async (req, res) => {
  try {
    const { userId, gymId } = req.body;
    const attendance = await attendanceService.createAttendance(userId, gymId);
    res.status(201).json(attendance);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAttendanceAnalytics = async (req, res) => {
  try {
    const analytics = await attendanceService.getAttendanceAnalytics();
    res.status(200).json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAttendancePerUser = async (req, res) => {
  try {
    const analytics = await attendanceService.getAttendancePerUser();
    res.status(200).json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAttendancePerWeek = async (req, res) => {
  try {
    const analytics = await attendanceService.getAttendancePerWeek();
    res.status(200).json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDaysPerMonth = async (req, res) => {
  try {
    const analytics = await attendanceService.getDaysPerMonth();
    res.status(200).json(analytics);
  } catch (error) {
    res.status500().json({ error: error.message });
  }
};
