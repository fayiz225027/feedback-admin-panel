import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, GraduationCap, Menu, X, Activity } from 'lucide-react';
import { checkHealth } from '../services/api';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [serverStatus, setServerStatus] = useState('checking'); // 'connected', 'disconnected', 'checking'

  useEffect(() => {
    let isMounted = true;
    const verifyStatus = async () => {
      try {
        const res = await checkHealth();
        if (isMounted) {
          if (res?.database?.connected) {
            setServerStatus('connected');
          } else {
            setServerStatus('warning');
          }
        }
      } catch (err) {
        if (isMounted) {
          setServerStatus('disconnected');
        }
      }
    };

    verifyStatus();
    const interval = setInterval(verifyStatus, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="navbar-wrapper">
      <div className="navbar-container">
        {/* Brand Logo & Name */}
        <NavLink to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
          <div className="logo-icon-box">
            <GraduationCap size={24} className="logo-icon" />
          </div>
          <div className="brand-text">
            <span className="brand-title">EduAdmin</span>
            <span className="brand-subtitle">Feedback Management</span>
          </div>
        </NavLink>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-tab ${isActive ? 'nav-tab-active' : ''}`}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/add"
            className={({ isActive }) => `nav-tab ${isActive ? 'nav-tab-active' : ''}`}
          >
            <PlusCircle size={18} />
            <span>Add Feedback</span>
          </NavLink>
        </nav>

        {/* Server & DB Status Badge */}
        <div className="navbar-right">
          <div
            className={`status-pill status-${serverStatus}`}
            title={`Backend Status: ${serverStatus}`}
          >
            <span className="status-dot"></span>
            <span className="status-label">
              {serverStatus === 'connected'
                ? 'DB Connected'
                : serverStatus === 'warning'
                ? 'Server Up (DB Check)'
                : 'Offline'}
            </span>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `mobile-nav-link ${isActive ? 'mobile-active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/add"
            className={({ isActive }) => `mobile-nav-link ${isActive ? 'mobile-active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <PlusCircle size={20} />
            <span>Add Feedback</span>
          </NavLink>
        </div>
      )}
    </header>
  );
};

export default Navbar;
