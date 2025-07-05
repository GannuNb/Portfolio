import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import {
  FaReact, FaNodeJs, FaHtml5, FaCss3Alt, FaJsSquare, FaGithub
} from "react-icons/fa";
import { SiMongodb, SiFigma, SiSelenium } from "react-icons/si";
import "./About.css";

const Skills = () => {
  return (
    <Container className="about-container my-5 py-5">
      <Card className="about-card shadow-lg p-4">
        <Row className="justify-content-center">
          <Col lg={10}>
            <Row>
              {/* About Me Text */}
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
              </Col>

              {/* Right Side: Skills and Icons */}
              <Col
                md={4}
                className="d-flex flex-column align-items-center justify-content-center tech-icons"
              >
                <h2 className="text-pink fw-bold mb-4">Skillset</h2>
                <div className="toggle-content mt-4">
                  <h4 className="text-pink">Skills</h4>
                  <h3 className="mt-3">Programming</h3>
                  <p>HTML • CSS • JavaScript • SQL • MongoDB • Python</p>
                  <p>Concepts: Data Structures and Algorithms</p>
                  <p>Testing: Selenium</p>

                  <h3 className="mt-3">Design</h3>
                  <p>Figma • Canva • Adobe XD</p>

                  <h3 className="mt-3">Frameworks</h3>
                  <p>Bootstrap • React.js • Node.js • jQuery</p>

                  <h3 className="mt-3">Tools/Platforms</h3>
                  <p>Git • GitHub</p>
                </div>

                {/* Tech Icons */}
                <FaReact className="tech-icon react" />
                <FaNodeJs className="tech-icon node" />
                <SiMongodb className="tech-icon mongo" />
                <FaHtml5 className="tech-icon html" />
                <FaCss3Alt className="tech-icon css" />
                <FaJsSquare className="tech-icon js" />
                <SiFigma className="tech-icon figma" />
                <FaGithub className="tech-icon github" />
                <SiSelenium className="tech-icon selenium" />
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default Skills;
