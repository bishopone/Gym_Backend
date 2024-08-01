const express = require('express');
const userRoutes = require('./userRoutes'); 
const productRoutes = require('./productRoutes'); 
const permissionRoutes = require('./permissionRoutes');
const roleRoutes = require('./roleRoutes');
const gymRoutes = require('./gymRoutes');
const transactionRoutes = require('./transactionRoutes');
const auditLogRoutes = require('./auditLogRoutes');
const membershipRoutes = require('./membershipRoutes');
const subscriptionRoutes = require('./subscriptionRoutes');
const subscriptionTypeRoutes = require('./subscriptionType');
const analyticsRoutes = require('./analyticsRoutes');
const attendanceRoute = require('./attendanceRoutes');
const cardConfigRoutes = require('./cardConfigRoutes'); // Adjust path as needed

const passport = require('passport');

const router = express.Router();

router.use('/gyms', passport.authenticate('jwt', { session: false}), gymRoutes);
router.use('/users', userRoutes);
router.use('/products',passport.authenticate('jwt', { session: false}),  productRoutes);
router.use('/permissions',passport.authenticate('jwt', { session: false}),  permissionRoutes);
router.use('/transactions',passport.authenticate('jwt', { session: false}),  transactionRoutes);
router.use('/audit-logs',passport.authenticate('jwt', { session: false}),  auditLogRoutes);
router.use('/memberships',passport.authenticate('jwt', { session: false}),  membershipRoutes);
router.use('/roles',passport.authenticate('jwt', { session: false}),  roleRoutes);
router.use('/subscriptions',passport.authenticate('jwt', { session: false}),  subscriptionRoutes);
router.use('/subscription-types',passport.authenticate('jwt', { session: false}),  subscriptionTypeRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/attendance', attendanceRoute);
router.use('/cardConfig',passport.authenticate('jwt', { session: false}), cardConfigRoutes);


module.exports = router;
