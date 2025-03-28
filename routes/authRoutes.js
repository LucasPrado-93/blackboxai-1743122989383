const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateSignup, validateLogin } = require('../middleware/validation');

// POST /api/auth/signup
router.post('/signup', validateSignup, authController.signup);

// POST /api/auth/login
router.post('/login', validateLogin, authController.login);

// POST /api/auth/logout
router.post('/logout', authController.logout);

// GET /api/auth/me (get current user)
router.get('/me', authController.getCurrentUser);

module.exports = router;