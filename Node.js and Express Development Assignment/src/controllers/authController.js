const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

// @desc    Register a new user
// @route   POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both username and password'
      });
    }

    const userExists = await User.findOne({ username: username.trim() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Username is already taken'
      });
    }

    const user = await User.create({
      username: username.trim(),
      password
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        avatarColor: user.avatarColor,
        isOnline: user.isOnline
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username and password'
      });
    }

    const user = await User.findOne({ username: username.trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        avatarColor: user.avatarColor,
        isOnline: user.isOnline
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
};

// @desc    Get list of all registered users
// @route   GET /api/auth/users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ isOnline: -1, username: 1 });
    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  getUsers
};
