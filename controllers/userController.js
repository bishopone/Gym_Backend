const passport = require("passport");
const userService = require("../services/userService");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.register = async (req, res) => {
  try {
    const newUser = await userService.registerUser(
      req.body,
      req.files?.profileImage,
      req.user
    );
    res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

exports.edit = async (req, res) => {
  try {
    console.log(req.files);

    const updatedUser = await userService.updateUser(
      parseInt(req.params.id),
      req.body,
      req.files?.profileImage
    );

    res.json(updatedUser);
  } catch (error) {
    console.log(error);

    res.status(400).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const users = await userService.getAllUsers(req, page, limit);
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const users = await userService.getUserById(req.params.id);
    res.json(users);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error.message });
  }
};

exports.editProfilePicture = async (req, res) => {
  try {
    await userService.saveProfileImage(req.user.id, req.files?.profileImage);
    res.json({ message: "Profile picture updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ message: info.message });

    if (err) return next(err);
    const token = jwt.sign(
      { userId: user.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_LIFE }
    );
    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_LIFE }
    );

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
    });
    res.json({ token, user });
  })(req, res, next);
  passport.authenticate("remember-me");
};

exports.refreshToken = (req, res) => {
  const { refresh_token } = req.cookies;
  if (!refresh_token)
    return res.status(401).json({ message: "No refresh token" });

  try {
    const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
    const newToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_LIFE }
    );
    res.json({ token: newToken });
  } catch (error) {
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

exports.logout = (req, res) => {
  try {
    res.clearCookie("refresh_token");
    res.json({ message: "Logged out" });
  } catch (e) {}
};

exports.fuzzySearchUsers = async (req, res) => {
  const { query } = req.query;
  const { role } = req.query;
  const { gymId } = req.user;
  try {
    const results = await userService.fuzzySearchUsers(query, role, gymId);
    res.status(200).json(results);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUserById = async (req, res) => {
  try {
    const users = await userService.deleteUserById(req.params.id);
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

exports.getExpiredSubscriptions = async (req, res) => {
  try {
    const users = await userService.getExpiredSubscriptions();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

exports.getExpiredToday = async (req, res) => {
  try {
    const users = await userService.getExpiredToday();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

exports.getExpiringThisWeek = async (req, res) => {
  try {
    const users = await userService.getExpiringThisWeek();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

exports.getUnsubscribedUsers = async (req, res) => {
  try {
    const users = await userService.getUnsubscribedUsers();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};
