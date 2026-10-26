const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    courseId: {
      type: String,
      required: [true, 'Course ID is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    courseName: {
      type: String,
      required: [true, 'Course Name is required'],
      trim: true,
    },
    courseDuration: {
      type: String,
      required: [true, 'Course Duration is required'],
      trim: true,
    },
    feedbackComments: {
      type: String,
      required: [true, 'Feedback Comments are required'],
      trim: true,
    },
    feedbackRating: {
      type: Number,
      required: [true, 'Feedback Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
  },
  {
    timestamps: true,
  }
);

// Function to generate unique Course ID if missing
feedbackSchema.statics.generateUniqueCourseId = async function () {
  let unique = false;
  let candidateId = '';
  while (!unique) {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    candidateId = `CRS-${randomNum}`;
    const existing = await this.findOne({ courseId: candidateId });
    if (!existing) {
      unique = true;
    }
  }
  return candidateId;
};

module.exports = mongoose.model('Feedback', feedbackSchema);
