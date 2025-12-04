import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navigation.css";

const Navigation = () => {
  const location = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAboutDropdown, setShowAboutDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const toggleMobileMenu = () => setShowMobileMenu(!showMobileMenu);
  const toggleAboutDropdown = () => setShowAboutDropdown((prev) => !prev);

  const closeMenus = () => {
    setShowMobileMenu(false);
    setShowAboutDropdown(false);
  };

  const isActive = (path) => location.pathname === path;

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowAboutDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="custom-navbar">
      <div className="nav-container">
        {/* Hamburger */}
        <div className="hamburger" onClick={toggleMobileMenu}>
          <div className="bar" />
          <div className="bar" />
          <div className="bar" />
        </div>

        {/* Logo */}
        <Link to="/" onClick={closeMenus} className="brand-link">
          <div className="brand-text">
            <span role="img" aria-label="rocket">🚀</span> Ganesh's Portfolio
          </div>
        </Link>

        {/* Nav Links */}
        <div className={`nav-links-wrapper ${showMobileMenu ? "show" : ""}`}>
          <div className="nav-links">
            <Link to="/" className={`nav-item ${isActive("/") ? "active-link" : ""}`} onClick={closeMenus}>Home</Link>

            {/* About Dropdown */}
            <div ref={dropdownRef} className={`nav-item about-item ${isActive("/about") || isActive("/skills") ? "active-link" : ""}`}>
              <div onClick={toggleAboutDropdown}>
                ABOUT <span className="dropdown-arrow">{showAboutDropdown ? "▲" : "▼"}</span>
              </div>

              {showAboutDropdown && (
                <div className="dropdown-menu-custom">
                  <Link
                    to="/about"
                    className="dropdown-link"
                    onClick={closeMenus} // closes dropdown after clicking
                  >
                    Education
                  </Link>
                  <Link
                    to="/skills"
                    className="dropdown-link"
                    onClick={closeMenus} // closes dropdown after clicking
                  >
                    Skillset
                  </Link>
                </div>
              )}
            </div>

            <Link to="/experience" className={`nav-item ${isActive("/experience") ? "active-link" : ""}`} onClick={closeMenus}>Experience</Link>
            <Link to="/projects" className={`nav-item ${isActive("/projects") ? "active-link" : ""}`} onClick={closeMenus}>Projects</Link>
            <Link to="/contact" className={`nav-item ${isActive("/contact") ? "active-link" : ""}`} onClick={closeMenus}>Contact</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
