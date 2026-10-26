const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Feedback = require('./models/Feedback');

dotenv.config();

const sampleFeedbacks = [
  {
    courseId: 'CRS-1001',
    courseName: 'Full Stack MERN Development',
    courseDuration: '12 Weeks',
    feedbackComments: 'Exceptional hands-on learning with MongoDB, Express, React, and Node.js. The architectural best practices and deployment workflows were top-tier.',
    feedbackRating: 5,
  },
  {
    courseId: 'CRS-1002',
    courseName: 'Data Structures & Algorithms in Java',
    courseDuration: '8 Weeks',
    feedbackComments: 'Intensive practice on trees, graphs, dynamic programming, and space-time complexity analysis. Great mentor support.',
    feedbackRating: 4,
  },
  {
    courseId: 'CRS-1003',
    courseName: 'UI/UX Design Masterclass & Design Systems',
    courseDuration: '6 Weeks',
    feedbackComments: 'Fantastic coverage of wireframing, typography, color accessibility, and responsive Figma component architecture.',
    feedbackRating: 5,
  },
  {
    courseId: 'CRS-1004',
    courseName: 'Cloud DevOps & Docker Containerization',
    courseDuration: '10 Weeks',
    feedbackComments: 'Solid hands-on labs for Dockerizing microservices, setting up CI/CD pipelines, and cloud hosting infrastructure.',
    feedbackRating: 4,
  },
];

const seedDB = async () => {
  try {
    if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('example.mongodb.net')) {
      console.error('\n[Error] Please configure a valid MONGODB_URI in backend/.env before running the seeder.\n');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('[Seeder] Connected to MongoDB Atlas...');

    // Clear existing records
    await Feedback.deleteMany();
    console.log('[Seeder] Cleared previous feedback records.');

    // Insert sample data
    const inserted = await Feedback.insertMany(sampleFeedbacks);
    console.log(`[Seeder] Successfully inserted ${inserted.length} sample feedback records!`);

    process.exit(0);
  } catch (error) {
    console.error('[Seeder Error]:', error.message);
    process.exit(1);
  }
};

seedDB();
