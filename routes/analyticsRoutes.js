const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.get('/members-per-day', analyticsController.getMembersPerDay);
router.get('/total-members', analyticsController.getTotalMembers);
router.get('/active-members', analyticsController.getActiveMembers);
router.get('/membership-expirations-per-day', analyticsController.getMembershipExpirationsPerDay);
router.get('/membership-renewals-per-day', analyticsController.getMembershipRenewalsPerDay);
router.get('/membership-Joined-today', analyticsController.getMembershipRegisteredPerDay);
router.get('/revenue-per-month', analyticsController.getRevenuePerMonth);
router.get('/popular-classes', analyticsController.getPopularClasses);

module.exports = router;
