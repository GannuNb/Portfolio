import React from "react";
import { Row, Col } from "react-bootstrap";
import { FaReact, FaNodeJs } from "react-icons/fa";
import { SiMongodb, SiExpress, SiFigma } from "react-icons/si";
import "./Experience.css";

const experiences = [
    {
      companyName: "VIKAH ECOTECH",
      companyLink: "https://www.vikahecotech.com/",
      role: "Full Stack Developer & UI/UX Designer",
      duration: "June 2024 – Current",
      location: "Nagole, Hyderabad",
      techStack: [<SiMongodb />, <SiExpress />, <FaReact />, <FaNodeJs />],
      image: "https://plus.unsplash.com/premium_photo-1720287601920-ee8c503af775?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d2ViJTIwZGV2ZWxvcG1lbnQlMjBzZXJ2aWNlc3xlbnwwfHwwfHx8MA%3D%3D", // Full Stack image
      points: [
        "Developed and maintained full-stack web applications using the MERN stack.",
        "Designed intuitive user interfaces with React and Figma.",
        "Developed RESTful APIs using Node.js and Express.",
        "Integrated MongoDB for data persistence.",
        "Collaborated with teams to create scalable features and improve overall performance.",
      ],
    },
    {
      companyName: "MAANG TECHNOLOGIES PVT LTD",
      companyLink: "https://maangtechnologies.com/",
      role: "Frontend Developer, UI/UX Designer & Selenium Tester",
      duration: "March 2023 – March 2024",
      location: "Hyderabad",
      techStack: [<FaReact />, <FaNodeJs />, <SiFigma />],
      image: "https://cdn-icons-png.flaticon.com/512/2721/2721274.png", // Frontend/Testing image
      points: [
        "Built responsive web applications using React.js and Redux.",
        "Designed user-friendly UI/UX interfaces with Figma.",
        "Developed test automation using Selenium for cross-browser testing.",
        "Worked with backend teams to integrate APIs and manage data flow.",
        "Conducted regular performance testing and optimizations.",
      ],
    },
  ];
  

const Experience = () => {
  return (
    <section className="experience-section py-5">
      <div className="container-fluid">
        <h2 className="text-center mb-5 heading-glow">Experience</h2>
        <Row className="justify-content-center no-gutters">
          {experiences.map((exp, idx) => (
            <Col key={idx} lg={6} className="experience-wrapper mb-5 d-flex">
              <div className="experience-item">

                {/* Content */}
                <div className="experience-content">
                  <div className="experience-header">
                    <h5 className="role">{exp.role}</h5>
                    <p className="company">
                      <a
                        href={exp.companyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {exp.companyName}
                      </a>
                    </p>
                  </div>
                  <p className="location-duration">
                    {exp.duration} | {exp.location}
                  </p>
                  <ul className="experience-details">
                    {exp.points.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                  <div className="tech-stack">
                    {exp.techStack.map((icon, index) => (
                      <span key={index} className="tech-icon">
                        {icon}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Circle on the RIGHT (nearer to content) */}
                <div className="exp-circle-wrapper-inside-right">
  <a href="/projects" className="exp-circle-link">
    <img
      src={exp.image}
      alt={exp.role}
      className="exp-circle-image"
    />
  </a>
</div>


              </div>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default Experience;
