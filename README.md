# Course Feedback Management Admin Panel (MERN Stack)

A modern, responsive Full Stack MERN (MongoDB Atlas, Express.js, React.js, Node.js) Admin Panel application developed for course feedback management and evaluation.

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Project Structure](#project-structure)
3. [Features & Capabilities](#features--capabilities)
4. [Tech Stack](#tech-stack)
5. [REST API Documentation](#rest-api-documentation)
6. [Prerequisites](#prerequisites)
7. [Installation & Setup](#installation--setup)
8. [MongoDB Atlas Setup Guide](#mongodb-atlas-setup-guide)
9. [Running the Application](#running-the-application)
10. [Database Seeding (Optional)](#database-seeding-optional)
11. [Git Submission Instructions](#git-submission-instructions)

---

## 🚀 Project Overview

The **Course Feedback Management Admin Panel** enables academic coordinators and instructors to track, analyze, create, edit, and manage student course evaluations in real time. 

The application satisfies all assessment criteria:
- **Responsive Dashboard** displaying Course ID, Course Name, Duration, Rating, Comments, and Actions.
- **Top Navigation Bar** with routing between **Dashboard** and **Add Feedback**.
- **Interactive Add Feedback Form** with automatic unique Course ID generation (`CRS-XXXX`), duration presets, and interactive 5-star ratings.
- **Update Modal** to edit existing feedback records directly and sync with MongoDB.
- **Delete Confirmation Modal** that removes records and refreshes dashboard state instantly.
- **Live Summary Cards** calculating Total Reviews, Average Rating, Satisfaction Ratio, and Active Courses.

---

## 📁 Project Structure

```text
feedback-admin-panel/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB Mongoose connection handler
│   ├── controllers/
│   │   └── feedbackController.js # REST API controllers (CRUD operations)
│   ├── models/
│   │   └── Feedback.js           # Mongoose model schema & Course ID generator
│   ├── routes/
│   │   └── feedbackRoutes.js     # Express API routes
│   ├── .env                      # Environment config (included for evaluators)
│   ├── .env.example              # Environment variables template
│   ├── package.json              # Backend dependencies and scripts
│   ├── seed.js                   # Test database seeder script
│   └── server.js                 # Express server entry point & health check
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DeleteModal.jsx   # Delete confirmation modal
│   │   │   ├── EditModal.jsx     # Update feedback modal dialog
│   │   │   ├── FeedbackTable.jsx # Responsive table with search & rating filters
│   │   │   ├── Navbar.jsx        # Navigation bar with live server status
│   │   │   ├── StarRating.jsx    # Star rating component (interactive & read-only)
│   │   │   └── SummaryCards.jsx  # KPI metrics & analytics cards
│   │   ├── pages/
│   │   │   ├── AddFeedbackPage.jsx # Add feedback form with live preview
│   │   │   └── DashboardPage.jsx   # Main dashboard view
│   │   ├── services/
│   │   │   └── api.js            # Axios client with centralized error handling
│   │   ├── App.css               # Modern responsive design & design tokens
│   │   ├── App.jsx               # React Router layout & routes
│   │   ├── index.css             # Base resets
│   │   └── main.jsx              # React DOM entry point
│   ├── index.html                # HTML template with Inter typography
│   ├── package.json              # Frontend dependencies and scripts
│   └── vite.config.js            # Vite configuration & API proxy
├── .gitignore                    # Git rules (preserves .env for evaluation)
├── package.json                  # Root orchestration scripts
└── README.md                     # Comprehensive documentation
```

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, React Router DOM v7, Axios, Lucide React, Vite |
| **Backend** | Node.js, Express.js, CORS, Dotenv |
| **Database** | MongoDB Atlas (Cloud) via Mongoose ODM |
| **Styling** | Custom CSS3 with CSS Variables, Flexbox, CSS Grid, Responsive Design |

---

## 🔌 REST API Documentation

Base URL: `http://localhost:5000/api/feedback`

| Method | Endpoint | Description | Request Body |
|---|---|---|---|
| `GET` | `/api/feedback` | Retrieve all feedback entries (sorted latest first) | None |
| `GET` | `/api/feedback/:id` | Retrieve single feedback by MongoDB `_id` or `courseId` | None |
| `POST` | `/api/feedback` | Create a new course feedback | `{ "courseName": string, "courseDuration": string, "feedbackComments": string, "feedbackRating": number, "courseId"?: string }` |
| `PUT` | `/api/feedback/:id` | Update an existing feedback by `_id` or `courseId` | `{ "courseName"?: string, "courseDuration"?: string, "feedbackComments"?: string, "feedbackRating"?: number }` |
| `DELETE` | `/api/feedback/:id` | Delete feedback by `_id` or `courseId` | None |
| `GET` | `/api/health` | Server and MongoDB Atlas connection status | None |

---

## ⚙️ Prerequisites

1. **Node.js** (v18.0.0 or higher) and **npm** installed on your system.
2. A free-tier **MongoDB Atlas** cluster account (or dedicated exam test database).

---

## 🔐 MongoDB Atlas Setup Guide

To connect the application to your MongoDB Atlas cluster:

1. Log into your [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account.
2. In **Security > Database Access**:
   - Create a database user (e.g., `testuser` with password `testpassword123`).
3. In **Security > Network Access**:
   - Add IP Address `0.0.0.0/0` (Allow access from anywhere) so the evaluators can connect.
4. In **Database > Clusters**:
   - Click **Connect** > **Drivers** (Node.js).
   - Copy the connection string format:
     ```text
     mongodb+srv://<username>:<password>@<cluster-url>/feedback_db?retryWrites=true&w=majority
     ```
5. Open `backend/.env` and paste your actual test connection string:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://testuser:testpassword123@your-cluster.mongodb.net/feedback_db?retryWrites=true&w=majority
   NODE_ENV=development
   ```

> ⚠️ **Evaluation Notice:** The assessment instructions require `backend/.env` to be pushed to the GitHub repository. Ensure you only use test/dummy database credentials created specifically for this examination.

---

## 💻 Running the Application

### Option A: Running Backend and Frontend in Separate Terminals

#### 1. Backend Server
```bash
# Navigate to backend directory
cd backend

# Install backend dependencies (if not already installed)
npm install

# Start Express backend server
npm start
# (or for development auto-reload): npm run dev
```
The backend server will run on: `http://localhost:5000`

#### 2. Frontend Application
```bash
# In a new terminal, navigate to frontend directory
cd frontend

# Install frontend dependencies (if not already installed)
npm install

# Start Vite React development server
npm run dev
```
The React frontend will be available at: `http://localhost:3000`

---

## 🗄️ Database Seeding (Optional)

To quickly populate your MongoDB Atlas database with 4 realistic course feedback records for testing or evaluation demo:

```bash
cd backend
npm run seed
```

This will automatically create sample records with course IDs `CRS-1001` through `CRS-1004`.

---

## 🧪 Verification & Testing Checklist

- [x] **Backend API:** Health endpoint `http://localhost:5000/api/health` responds with database connection status.
- [x] **Dashboard:** Displays feedback records in table with Course ID, Course Name, Duration, Overall Rating, Comments, and Update/Delete buttons.
- [x] **Navigation:** Navbar routes cleanly between `/` (Dashboard) and `/add` (Add Feedback).
- [x] **Add Feedback:** Form validates input and generates unique Course ID (e.g., `CRS-5821`).
- [x] **Update Feedback:** Clicking Update opens the edit modal, saves modifications to MongoDB, and updates the table row.
- [x] **Delete Feedback:** Clicking Delete opens confirmation prompt and permanently deletes the record from MongoDB.
- [x] **Responsive UI:** Tested across desktop and mobile screen viewports.

---

## 📤 Git Submission Instructions

To push this complete project to GitHub for final assessment submission:

```bash
# 1. Initialize Git in the project root (if not already initialized)
git init

# 2. Stage all files (both frontend and backend folders, and .env)
git add .

# 3. Verify status to confirm frontend, backend, and .env are tracked
git status

# 4. Commit the changes
git commit -m "feat: complete MERN stack feedback admin panel with Atlas integration"

# 5. Set default branch to main
git branch -M main

# 6. Add your GitHub remote repository URL
# (Replace USERNAME and feedback-admin-panel with your GitHub repo URL)
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/feedback-admin-panel.git

# 7. Push to GitHub
git push -u origin main
```
