const express = require('express');
const router = express.Router();
const { chatWithAdvisor } = require('../controllers/aiController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.post('/chat', optionalAuth, chatWithAdvisor);

module.exports = router;
