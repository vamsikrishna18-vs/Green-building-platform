const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, clearNotifications } = require('../controllers/notificationController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.get('/', optionalAuth, getNotifications);
router.put('/:id/read', optionalAuth, markAsRead);
router.delete('/', optionalAuth, clearNotifications);

module.exports = router;
