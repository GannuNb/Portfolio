import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navigation.css";

const Navigation = () => {
  const location = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAboutDropdown, setShowAboutDropdown] = useState(false);

  const toggleMobileMenu = () => setShowMobileMenu(!showMobileMenu);
  const toggleAboutDropdown = () => setShowAboutDropdown((prev) => !prev);
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="custom-navbar">
      <div className="nav-container">
        {/* Hamburger on left */}
        <div className="hamburger" onClick={toggleMobileMenu}>
          <div className="bar" />
          <div className="bar" />
          <div className="bar" />
        </div>

        {/* Logo on right */}
        <Link to="/" onClick={() => setShowMobileMenu(false)} className="brand-link">
          <div className="brand-text">
            <span role="img" aria-label="rocket">🚀</span> Ganesh's Portfolio
          </div>
        </Link>

        {/* Nav links */}
        <div className={`nav-links-wrapper ${showMobileMenu ? "show" : ""}`}>
          <div className="nav-links">
            <Link to="/" className={`nav-item ${isActive("/") ? "active-link" : ""}`} onClick={() => setShowMobileMenu(false)}>Home</Link>

            <div className={`nav-item about-item ${isActive("/about") || isActive("/skills") ? "active-link" : ""}`}
              onMouseEnter={() => !showMobileMenu && setShowAboutDropdown(true)}
              onMouseLeave={() => !showMobileMenu && setShowAboutDropdown(false)}
              onClick={toggleAboutDropdown}>
              ABOUT <span className="dropdown-arrow">{showAboutDropdown ? "▲" : "▼"}</span>

              {showAboutDropdown && (
                <div className="dropdown-menu-custom">
                  <Link to="/about" className="dropdown-link" onClick={() => setShowMobileMenu(false)}>Education</Link>
                  <Link to="/skills" className="dropdown-link" onClick={() => setShowMobileMenu(false)}>Skillset</Link>
                </div>
              )}
            </div>

            <Link to="/experience" className={`nav-item ${isActive("/experience") ? "active-link" : ""}`} onClick={() => setShowMobileMenu(false)}>Experience</Link>
            <Link to="/projects" className={`nav-item ${isActive("/projects") ? "active-link" : ""}`} onClick={() => setShowMobileMenu(false)}>Projects</Link>
            <Link to="/contact" className={`nav-item ${isActive("/contact") ? "active-link" : ""}`} onClick={() => setShowMobileMenu(false)}>Contact</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
