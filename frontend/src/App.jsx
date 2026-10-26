import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import AddFeedbackPage from './pages/AddFeedbackPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/add" element={<AddFeedbackPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <footer className="app-footer">
          <div className="footer-content">
            <p>
              <strong>EduFeedback Admin Panel</strong> &bull; Developed by Fayiz (Roll No: 225027)
            </p>
            <p className="footer-subtext">
              MERN Stack Final Assessment &bull; MongoDB Atlas &bull; Express.js &bull; React.js &bull; Node.js
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
