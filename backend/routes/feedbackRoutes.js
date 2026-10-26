const express = require('express');
const router = express.Router();
const {
  getAllFeedback,
  getFeedbackById,
  createFeedback,
  updateFeedback,
  deleteFeedback,
} = require('../controllers/feedbackController');

// /api/feedback routes
router.route('/')
  .get(getAllFeedback)
  .post(createFeedback);

// /api/feedback/:id routes
router.route('/:id')
  .get(getFeedbackById)
  .put(updateFeedback)
  .delete(deleteFeedback);

module.exports = router;
