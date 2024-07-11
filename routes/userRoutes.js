const express = require('express');
const multer = require('multer');
const passport = require('passport');
const userController = require('../controllers/userController');

const router = express.Router();
const upload = multer();

// Authentication routes
router.post('/login', userController.login);
router.post('/refresh-token', userController.refreshToken);
router.post('/logout', passport.authenticate('jwt', { session: false }), userController.logout);
router.get('/check', passport.authenticate('jwt', { session: false }), (req, res) => res.send(req.user));

// Subscription routes
router.get('/expired-subscriptions', passport.authenticate('jwt', { session: false }), userController.getExpiredSubscriptions);
router.get('/expired-today', passport.authenticate('jwt', { session: false }), userController.getExpiredToday);
router.get('/expiring-this-week', passport.authenticate('jwt', { session: false }), userController.getExpiringThisWeek);


// User routes
router.post('/register', passport.authenticate('jwt', { session: false }), upload.single('profileImage'), userController.register);
router.post('/edit/:id', passport.authenticate('jwt', { session: false }), upload.single('profileImage'), userController.edit);
router.post('/edit-profile-picture', passport.authenticate('jwt', { session: false }), upload.single('profileImage'), userController.editProfilePicture);
router.get('/search', passport.authenticate('jwt', { session: false }), userController.fuzzySearchUsers);
router.get('/', passport.authenticate('jwt', { session: false }), userController.getAllUsers);
router.get('/:id', passport.authenticate('jwt', { session: false }), userController.getUserById);
router.delete('/:id', passport.authenticate('jwt', { session: false }), userController.deleteUserById);


module.exports = router;
