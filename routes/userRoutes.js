const express = require("express");
const multer = require("multer");
const passport = require("passport");
const userController = require("../controllers/userController");
const path = require('path');

const router = express.Router();

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Limit file size to 1MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('profileImage'); // Adjust according to your form field name

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Images Only!'));
  }
}

// Authentication routes
router.post("/login", userController.login);
router.post("/refresh-token", userController.refreshToken);
router.post(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  userController.logout
);
router.get(
  "/check",
  passport.authenticate("jwt", { session: false }),
  (req, res) => res.send(req.user)
);

// Subscription routes
router.get(
  "/expired-subscriptions",
  passport.authenticate("jwt", { session: false }),
  userController.getExpiredSubscriptions
);
router.get(
  "/expired-today",
  passport.authenticate("jwt", { session: false }),
  userController.getExpiredToday
);
router.get(
  "/expiring-this-week",
  passport.authenticate("jwt", { session: false }),
  userController.getExpiringThisWeek
);

// User routes with multer upload handling
router.post(
  "/register",
  passport.authenticate("jwt", { session: false }),
  function(req, res, next) {
    upload(req, res, function (err) {
      if (err) {
        console.error(err);
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  userController.register
);

router.post(
  "/edit/:id",
  passport.authenticate("jwt", { session: false }),
  function(req, res, next) {
    upload(req, res, function (err) {
      if (err) {
        console.error(err);
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  userController.edit
);

router.post(
  "/edit-profile-picture",
  passport.authenticate("jwt", { session: false }),
  function(req, res, next) {
    upload(req, res, function (err) {
      if (err) {
        console.error(err);
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  userController.editProfilePicture
);

router.get(
  "/search",
  passport.authenticate("jwt", { session: false }),
  userController.fuzzySearchUsers
);
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  userController.getAllUsers
);
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  userController.getUserById
);

module.exports = router;
