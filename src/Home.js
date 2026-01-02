import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import ganeshImage from "./images/Group 18.png";
import About from "./About"; // Importing About section

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <section className="hero-section" id="home">
        <Container>
          <Row className="align-items-center flex-nowrap">
            {/* Left Side - Text */}
            <Col lg={6} md={6} className="text-content">
              <h1 className="gradient-text">FULL STACK WEB DEVELOPER</h1>
              <p className="intro-text">
                I am <span className="highlight">Ganesh</span> –{" "}
                <span className="highlight">web developer</span> with a passion for
                creating beautiful and responsive websites.
              </p>

              <div className="btn-group">
                <Button className="cta-btn" onClick={() => {
                  const aboutSection = document.getElementById("about");
                  if (aboutSection) aboutSection.scrollIntoView({ behavior: "smooth" });
                }}>
                  About Me
                </Button>
                <Button className="cta-btn" onClick={() => navigate("/projects")}>
                  View My Work
                </Button>
                <Button className="cta-btn" onClick={() => navigate("/experience")}>
                  Experience
                </Button>
                <Button className="cta-btn" onClick={() => navigate("/resume")}>
                   Resume
                </Button>
              </div>
            </Col>

            {/* Right Side - Image with Contact Button at Bottom Right */}
            <Col lg={6} md={6} className="image-container">
              <div className="image-wrapper">
                <img src={ganeshImage} alt="Profile" className="profile-img img-fluid" />
                <Button
                  className="cta-btn contact-below-btn"
                  onClick={() => navigate("/contact")}
                >
                  Contact
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* About Section embedded in Home */}
      <section id="about">
        <About />
      </section>
    </>
  );
};

export default Home;
