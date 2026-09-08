const express = require('express');
const router = express.Router();
const { register, login, getMe, logout, googleLogin, googleCallback } = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/google/login', googleLogin);
router.get('/google/callback', googleCallback);
router.get('/me', requireAuth, getMe);
router.post('/logout', logout);

module.exports = router;
