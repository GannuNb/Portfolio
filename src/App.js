import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./Navbar";
import Home from "./Home";
import About from "./About";
import Projects from "./Projects";
import Contact from "./Contact";
import Footer from "./Footer";
import Experience from "./Experience";
import Skills from "./Skills";
import Resume from "./Resume";
import FresherResume from "./resumes/fresher/FresherResumeMern";
import ExperiencedResume from "./resumes/experienced/ExperiencedResumeMern";

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/resume" element={<Resume/>} />
        <Route path="/resume/freshermern" element={<FresherResume />} />
        <Route path="/resume/experiencedmern" element={<ExperiencedResume />} />

      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
