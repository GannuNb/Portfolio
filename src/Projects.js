import React from "react";
import { Container } from "react-bootstrap";
import "./Projects.css";

const industryProjects = [
  {
    title: "RubberScrapMart – A Marketplace",
    description:
      "E‑commerce platform for rubber scrap trading with product listing, shipment tracking, admin/vendor dashboards, and auto email updates. Deployed on Hostinger.",
    link: "https://rubberscrapmart.com/",
  },
  {
    title: "LGIndustry – Manufacturing Web Platform",
    description:
      "Website for Lakshmi Ganapathi Industries to showcase products and enable smooth navigation and contact inquiries. Fully responsive and optimized.",
    link: "https://lgindustry.in/",
  },
  {
    title: "Vikah Ecotech - Recycling Platform",
    description:
      "React + Node.js platform developed at Vikah Ecotech for recommending eco‑friendly recycling machines based on criteria.",
    link: "https://www.vikahecotech.com/",
  },
  {
    title: "Venkata Siva Sai Industries – Rubber Crumb & Granules",
    description:
      "Site highlights VSSI’s production of rubber crumb and EPDM granules, with ISO‑compliant manufacturing in Telangana. Focused on quality control and PAN‑India & export markets.",
    link: "https://vssi.in/",
  },
  
{
  title: "Saraswathi Rubbers – Crumb Rubber & EPDM Solutions",
  description:
    "Designed and developed a responsive website for Saraswathi Rubbers to showcase their products like Crumb Rubber, EPDM Granules, and Tyre Wire. Focused on clean UI, fast performance, and effective customer engagement.",
  link: "https://saraswathirubbers.com/",
},

  {
    title: "Vikahrubbers – Rubber Manufacturing Solutions",
    description:
      "Dedicated site for Vikahrubbers offering custom rubber manufacturing—products, capabilities, contact info—clean design and easy navigation.",
    link: "https://vikahrubbers.com/",
  },
];

const academicProjects = [
  {
    title: "Diabetes Prediction",
    description:
      "Python ML project to predict diabetes using health data, aimed at early diagnosis and prevention.",
  },
  {
    title: "Exam Cell System",
    description:
      "SQL‑powered system for managing internal student academic performance and reporting efficiently.",
  },
];

const Projects = () => {
  return (
    <section className="projects-section">
      <Container>
        <h2 className="text-center heading-glow mb-5">Projects</h2>

        <h3 className="text-center text-pink section-label">Industry Projects</h3>
        <div className="projects-wrapper mb-5">
          {industryProjects.map((project, index) => (
            <a
              key={index}
              className="project-circle shadow-lg"
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <h4 className="project-title">{project.title}</h4>
              <p className="project-desc">{project.description}</p>
            </a>
          ))}
        </div>

        <h3 className="text-center text-pink section-label">Academic Projects</h3>
        <div className="projects-wrapper">
          {academicProjects.map((project, index) => (
            <div key={index} className="project-circle shadow-lg">
              <h4 className="project-title">{project.title}</h4>
              <p className="project-desc">{project.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Projects;
