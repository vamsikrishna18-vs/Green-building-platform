const express = require('express');
const router = express.Router();
const {
  createAssessment,
  simulateAssessment,
  getAllAssessments,
  getAssessmentById,
  deleteAssessment,
  getAnalytics,
  getBenchmarks,
  calculateRoi
} = require('../controllers/assessmentController');
const { optionalAuth, requireAuth } = require('../middleware/authMiddleware');

router.post('/simulate', optionalAuth, simulateAssessment);
router.post('/roi-calculator', optionalAuth, calculateRoi);
router.get('/analytics', optionalAuth, getAnalytics);
router.get('/benchmarks', optionalAuth, getBenchmarks);
router.post('/', optionalAuth, createAssessment);
router.get('/', optionalAuth, getAllAssessments);
router.get('/:id', optionalAuth, getAssessmentById);
router.delete('/:id', optionalAuth, deleteAssessment);

module.exports = router;
