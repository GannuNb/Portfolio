import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">

        {/* Left: Navigation Links */}
        <div className="footer-nav">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/experience">Experience</Link>
          <Link to="/resume">Resume</Link>
          <Link to="/contact">Contact</Link>
        </div>

        {/* Center: Copyright Text */}
        <div className="footer-center">
          <p>&copy; 2025 Ganesh Nallabapineni</p>
          <p>Designed by <a href="/">Ganesh Nallabapineni</a></p>
        </div>

        {/* Right: Social Icons */}
        <div className="footer-icons">
          <a href="https://github.com/GannuNb" target="_blank" rel="noreferrer"><FaGithub /></a>
          <a href="https://www.linkedin.com/in/ganesh-nallabapineni-05113826b" target="_blank" rel="noreferrer"><FaLinkedin /></a>
          <a href="mailto:nbganesh1818@gmail.com"><FaEnvelope /></a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
  