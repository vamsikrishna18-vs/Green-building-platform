const Goal = require('../models/Goal');
const mongoose = require('mongoose');

const memoryGoalsStore = [];

function isDbConnected() {
  return mongoose.connection.readyState === 1;
}

exports.createGoal = async (req, res, next) => {
  try {
    const { title, category, targetValue, currentValue, unit, deadline } = req.body;

    if (!title || targetValue === undefined || currentValue === undefined) {
      return res.status(400).json({ error: 'Title, target value, and current value are required.' });
    }

    const userId = req.user ? req.user._id : null;
    let status = 'On Track';
    if (Number(currentValue) >= Number(targetValue)) {
      status = 'Completed';
    }

    const goalPayload = {
      userId,
      title: title.trim(),
      category: category || 'Overall',
      targetValue: Number(targetValue),
      currentValue: Number(currentValue),
      unit: unit || 'pts',
      deadline: deadline ? new Date(deadline) : null,
      status,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    let result;
    if (isDbConnected()) {
      const doc = new Goal(goalPayload);
      result = await doc.save();
    } else {
      result = {
        _id: 'goal_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
        ...goalPayload
      };
      memoryGoalsStore.unshift(result);
    }

    return res.status(201).json({
      success: true,
      message: 'Sustainability goal created successfully.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

exports.getGoals = async (req, res, next) => {
  try {
    let goals = [];
    if (isDbConnected()) {
      const filter = {};
      if (req.user) {
        filter.$or = [
          { userId: req.user._id },
          { userId: null },
          { userId: { $exists: false } }
        ];
      }
      goals = await Goal.find(filter).sort({ createdAt: -1 });
    } else {
      goals = [...memoryGoalsStore];
      if (req.user) {
        goals = goals.filter(g => !g.userId || g.userId.toString() === req.user._id.toString());
      }
    }

    return res.status(200).json({
      success: true,
      count: goals.length,
      data: goals
    });
  } catch (error) {
    next(error);
  }
};

exports.updateGoal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, category, targetValue, currentValue, unit, deadline, status } = req.body;

    let updatedStatus = status;
    if (currentValue !== undefined && targetValue !== undefined) {
      if (Number(currentValue) >= Number(targetValue)) {
        updatedStatus = 'Completed';
      }
    }

    if (isDbConnected() && !id.startsWith('goal_')) {
      const goal = await Goal.findById(id);
      if (!goal) return res.status(404).json({ error: 'Goal not found.' });

      if (title) goal.title = title;
      if (category) goal.category = category;
      if (targetValue !== undefined) goal.targetValue = Number(targetValue);
      if (currentValue !== undefined) goal.currentValue = Number(currentValue);
      if (unit) goal.unit = unit;
      if (deadline) goal.deadline = new Date(deadline);
      if (updatedStatus) goal.status = updatedStatus;

      const saved = await goal.save();
      return res.status(200).json({ success: true, data: saved });
    } else {
      const found = memoryGoalsStore.find(g => g._id === id);
      if (!found) return res.status(404).json({ error: 'Goal not found.' });

      if (title) found.title = title;
      if (category) found.category = category;
      if (targetValue !== undefined) found.targetValue = Number(targetValue);
      if (currentValue !== undefined) found.currentValue = Number(currentValue);
      if (unit) found.unit = unit;
      if (deadline) found.deadline = new Date(deadline);
      if (updatedStatus) found.status = updatedStatus;

      return res.status(200).json({ success: true, data: found });
    }
  } catch (error) {
    next(error);
  }
};

exports.deleteGoal = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected() && !id.startsWith('goal_')) {
      await Goal.findByIdAndDelete(id);
    } else {
      const index = memoryGoalsStore.findIndex(g => g._id === id);
      if (index !== -1) memoryGoalsStore.splice(index, 1);
    }

    return res.status(200).json({
      success: true,
      message: 'Goal deleted successfully.',
      deletedId: id
    });
  } catch (error) {
    next(error);
  }
};
