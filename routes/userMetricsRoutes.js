// userMetricsRoutes.js
const express = require('express');
const {
  handleUpsertUserMetrics,
  handleGetUserMetrics,
  handleTrackAttendance,
  handleCountUserGymVisits,
} = require('../controllers/userMetricsController');

const router = express.Router();

// Upsert User Metrics
router.post('/metrics', handleUpsertUserMetrics);

// Get User Metrics
router.get('/metrics/:userId', handleGetUserMetrics);

// Track Attendance
router.post('/attendance', handleTrackAttendance);

// Count User Gym Visits
router.get('/attendance/count', handleCountUserGymVisits);

module.exports = router;
