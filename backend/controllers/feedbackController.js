const mongoose = require('mongoose');
const Feedback = require('../models/Feedback');

// Helper to determine whether id is an ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    Get all feedback records
// @route   GET /api/feedback
// @access  Public
const getAllFeedback = async (req, res) => {
  try {
    const feedbackList = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: feedbackList.length,
      data: feedbackList,
    });
  } catch (error) {
    console.error('Error in getAllFeedback:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching feedback records',
      error: error.message,
    });
  }
};

// @desc    Get single feedback by ID or Course ID
// @route   GET /api/feedback/:id
// @access  Public
const getFeedbackById = async (req, res) => {
  try {
    const { id } = req.params;
    let feedback;

    if (isValidObjectId(id)) {
      feedback = await Feedback.findById(id);
    }
    if (!feedback) {
      feedback = await Feedback.findOne({ courseId: id.toUpperCase() });
    }

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: `Feedback not found with ID: ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    console.error('Error in getFeedbackById:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching single feedback',
      error: error.message,
    });
  }
};

// @desc    Create new course feedback record
// @route   POST /api/feedback
// @access  Public
const createFeedback = async (req, res) => {
  try {
    let { courseId, courseName, courseDuration, feedbackComments, feedbackRating } = req.body;

    if (!courseName || !courseDuration || !feedbackComments || feedbackRating === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide courseName, courseDuration, feedbackComments, and feedbackRating',
      });
    }

    // Generate unique course ID if not provided or empty
    if (!courseId || courseId.trim() === '') {
      courseId = await Feedback.generateUniqueCourseId();
    } else {
      courseId = courseId.trim().toUpperCase();
      const existing = await Feedback.findOne({ courseId });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: `Course ID ${courseId} already exists. Please provide a unique ID or leave empty to auto-generate.`,
        });
      }
    }

    const ratingNum = Number(feedbackRating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({
        success: false,
        message: 'Feedback rating must be a number between 1 and 5',
      });
    }

    const newFeedback = await Feedback.create({
      courseId,
      courseName: courseName.trim(),
      courseDuration: courseDuration.trim(),
      feedbackComments: feedbackComments.trim(),
      feedbackRating: ratingNum,
    });

    res.status(201).json({
      success: true,
      message: 'Feedback created successfully',
      data: newFeedback,
    });
  } catch (error) {
    console.error('Error in createFeedback:', error.message);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while creating feedback',
      error: error.message,
    });
  }
};

// @desc    Update existing feedback record
// @route   PUT /api/feedback/:id
// @access  Public
const updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { courseName, courseDuration, feedbackComments, feedbackRating } = req.body;

    let query = {};
    if (isValidObjectId(id)) {
      query._id = id;
    } else {
      query.courseId = id.toUpperCase();
    }

    const feedback = await Feedback.findOne(query);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: `Feedback not found with ID: ${id}`,
      });
    }

    if (courseName !== undefined) feedback.courseName = courseName.trim();
    if (courseDuration !== undefined) feedback.courseDuration = courseDuration.trim();
    if (feedbackComments !== undefined) feedback.feedbackComments = feedbackComments.trim();
    if (feedbackRating !== undefined) {
      const ratingNum = Number(feedbackRating);
      if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        return res.status(400).json({
          success: false,
          message: 'Feedback rating must be between 1 and 5',
        });
      }
      feedback.feedbackRating = ratingNum;
    }

    const updatedFeedback = await feedback.save();

    res.status(200).json({
      success: true,
      message: 'Feedback updated successfully',
      data: updatedFeedback,
    });
  } catch (error) {
    console.error('Error in updateFeedback:', error.message);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while updating feedback',
      error: error.message,
    });
  }
};

// @desc    Delete feedback record
// @route   DELETE /api/feedback/:id
// @access  Public
const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    let query = {};
    if (isValidObjectId(id)) {
      query._id = id;
    } else {
      query.courseId = id.toUpperCase();
    }

    const deletedFeedback = await Feedback.findOneAndDelete(query);

    if (!deletedFeedback) {
      return res.status(404).json({
        success: false,
        message: `Feedback not found with ID: ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Feedback deleted successfully',
      data: deletedFeedback,
    });
  } catch (error) {
    console.error('Error in deleteFeedback:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting feedback',
      error: error.message,
    });
  }
};

module.exports = {
  getAllFeedback,
  getFeedbackById,
  createFeedback,
  updateFeedback,
  deleteFeedback,
};
