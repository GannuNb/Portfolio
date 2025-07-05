import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "./About.css";

const About = () => {
  return (
    <Container className="about-container my-5 py-5">
      <Card className="about-card shadow-lg p-4">
        <Row className="justify-content-center">
          <Col lg={10}>
            <Row>
              {/* About Text */}
              <Col md={8} className="about-text">
                <h2 className="text-pink fw-bold mb-4">About Me</h2>
                <p className="animated-text">
                  Hey! I’m a <strong>Full Stack Web Developer</strong> with a
                  passion for building clean, responsive, and scalable web
                  applications using the <strong>MERN stack</strong>. I enjoy
                  creating beautiful user interfaces, writing efficient backend
                  logic, and solving real-world problems through elegant code.
                </p>
                <p className="animated-text">
                  I'm constantly learning and exploring new technologies, with a
                  strong focus on delivering value through user-centered design
                  and functional development. Currently pursuing a B.Tech in
                  Computer Science at <strong>IIIT RGUKT RK Valley</strong>.
                </p>

                <div className="toggle-content mt-4">
                  <h4 className="text-pink">Education</h4>
                  <ul>
                    <li>
                      <strong>AP IIIT RGUKT RK Valley</strong><br />
                      B.Tech (CSE), 2020–2024 — CGPA: 8.1
                    </li>
                    <li>
                      <strong>PUC (M.P.C)</strong>, 2018–2020 — CGPA: 8.6
                    </li>
                    <li>
                      <strong>SSC — Govt High School, Pulivendula</strong><br />
                      CGPA: 9.8
                    </li>
                  </ul>
                </div>
              </Col>

              {/* Optional: Remove tech icons or move them to Skills page */}
            </Row>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default About;
