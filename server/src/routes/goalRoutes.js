const express = require('express');
const router = express.Router();
const { createGoal, getGoals, updateGoal, deleteGoal } = require('../controllers/goalController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.post('/', optionalAuth, createGoal);
router.get('/', optionalAuth, getGoals);
router.put('/:id', optionalAuth, updateGoal);
router.delete('/:id', optionalAuth, deleteGoal);

module.exports = router;
