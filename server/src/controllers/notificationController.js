const Notification = require('../models/Notification');
const mongoose = require('mongoose');

const memoryNotifications = [
  {
    _id: 'notif_1',
    title: 'Rating Milestone Near',
    message: 'Your building is only 4 points away from Good rating tier!',
    type: 'milestone',
    isRead: false,
    createdAt: new Date()
  },
  {
    _id: 'notif_2',
    title: 'Carbon Target Achieved',
    message: 'Simulated upgrades reduced annual carbon footprint by 38%.',
    type: 'success',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000)
  }
];

function isDbConnected() {
  return mongoose.connection.readyState === 1;
}

exports.getNotifications = async (req, res, next) => {
  try {
    let list = [];
    if (isDbConnected()) {
      const filter = {};
      if (req.user) {
        filter.$or = [
          { userId: req.user._id },
          { userId: null },
          { userId: { $exists: false } }
        ];
      }
      list = await Notification.find(filter).sort({ createdAt: -1 });
    } else {
      list = [...memoryNotifications];
    }

    return res.status(200).json({
      success: true,
      count: list.length,
      unreadCount: list.filter(n => !n.isRead).length,
      data: list
    });
  } catch (error) {
    next(error);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (isDbConnected() && !id.startsWith('notif_')) {
      await Notification.findByIdAndUpdate(id, { isRead: true });
    } else {
      const found = memoryNotifications.find(n => n._id === id);
      if (found) found.isRead = true;
    }

    return res.status(200).json({ success: true, message: 'Notification marked as read.' });
  } catch (error) {
    next(error);
  }
};

exports.clearNotifications = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const filter = req.user ? { userId: req.user._id } : {};
      await Notification.deleteMany(filter);
    } else {
      memoryNotifications.length = 0;
    }

    return res.status(200).json({ success: true, message: 'Notifications cleared.' });
  } catch (error) {
    next(error);
  }
};
