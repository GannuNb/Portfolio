import React from "react";
import { Container } from "react-bootstrap";
import "./Projects.css";

const projects = [
  {
    title: "RECYCLING MACHINERY PLATFORM",
    description:
      "Created the company website for Vikah Ecotech, providing an interactive, user-friendly interface that helps clients explore and choose recycling solutions.",
    link: "https://www.vikahecotech.com/",
  },
  {
    title: "RUBBERSCRAPMART – A MARKETPLACE",
    description:
      "Developed a full-stack e-commerce marketplace for buying and selling rubberscrap materials, integrating product listing, order management, and shipment tracking features.",
    link: "https://rubberscrapmart.com/",
  },
  {
    title: "LAVARUBBERLLC – SCRAP TRADING PLATFORM",
    description:
      "Built a full-stack platform for trading Ferrous, Non-Ferrous, and Tyre Scrap, enabling easy product browsing and purchasing. Buyers and suppliers can also manage container products on the site.",
    link: "https://lavarubberllc.com/",
  },
  {
    title: "LG INDUSTRY – INDUSTRIAL MATERIALS PLATFORM",
    description:
      "Built a responsive web platform showcasing products like Crumb Rubber, EPDM Granules, and Tyre Wire, designed for user-friendly navigation and seamless product inquiries.",
    link: "https://lgindustry.in/",
  },
  {
    title: "Venkata Siva Sai Industries – Rubber Crumb & Granules",
    description:
      "Site highlights VSSI’s production of rubber crumb and EPDM granules, with ISO-compliant manufacturing in Telangana. Focused on quality control and PAN-India & export markets.",
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
  // Academic Projects (kept in the same array but will be shown separately)
  {
    title: "Diabetes Prediction",
    description:
      "Python ML project to predict diabetes using health data, aimed at early diagnosis and prevention.",
    link: "#",
  },
  {
    title: "Exam Cell System",
    description:
      "SQL-powered system for managing internal student academic performance and reporting efficiently.",
    link: "#",
  },
];

const Projects = () => {
  // keep original list intact — separate academic projects (last two)
  const mainProjects = projects.slice(0, projects.length - 2);
  const academicProjects = projects.slice(projects.length - 2);

  return (
    <section className="projects-section">
      <Container fluid="lg">
        <h2 className="text-center heading-glow mb-5">Projects</h2>

        <div className="projects-grid">
          {mainProjects.map((project, index) => (
            <article
              key={index}
              className="project-card"
              aria-labelledby={`p-title-${index}`}
            >
              <div className="project-card-inner">
                <h3 id={`p-title-${index}`} className="project-title">
                  {project.title}
                </h3>
                <p className="project-desc">{project.description}</p>
                <div className="project-actions">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-button"
                  >
                    Visit Site
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Academic projects section — separated and styled slightly smaller */}
        <section className="academic-section">
          <h3 className="academic-heading">Academic Projects</h3>
          <div className="academic-grid">
            {academicProjects.map((project, idx) => {
              const key = mainProjects.length + idx;
              return (
                <article
                  key={key}
                  className="project-card academic-card"
                  aria-labelledby={`academic-title-${idx}`}
                >
                  <div className="project-card-inner">
                    <h4 id={`academic-title-${idx}`} className="project-title">
                      {project.title}
                    </h4>
                    <p className="project-desc">{project.description}</p>
                    <div className="project-actions">
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-button"
                      >
                        View
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </Container>
    </section>
  );
};

export default Projects;
