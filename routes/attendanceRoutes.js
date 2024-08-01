const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

// Route to create an attendance
router.post('/create', attendanceController.createAttendance);

// Route to get attendance analytics
router.get('/analytics', attendanceController.getAttendanceAnalytics);

// Route to get attendance per user
router.get('/analytics/per-user', attendanceController.getAttendancePerUser);

// Route to get attendance per week
router.get('/analytics/per-week', attendanceController.getAttendancePerWeek);

// Route to get days per month
router.get('/analytics/days-per-month', attendanceController.getDaysPerMonth);

module.exports = router;
