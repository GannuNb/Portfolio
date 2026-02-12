import React from "react";
import { Container } from "react-bootstrap";
import styles from "./Projects.module.css";

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
      "Built a full-stack platform for trading Ferrous, Non-Ferrous, and Tyre Scrap, enabling easy product browsing and purchasing.",
    link: "https://lavarubberllc.com/",
  },
  {
    title: "LG INDUSTRY – INDUSTRIAL MATERIALS PLATFORM",
    description:
      "Built a responsive web platform showcasing products like Crumb Rubber, EPDM Granules, and Tyre Wire.",
    link: "https://lgindustry.in/",
  },
  {
    title: "Venkata Siva Sai Industries",
    description:
      "ISO-compliant rubber crumb & EPDM granules manufacturing site with export-focused presentation.",
    link: "https://vssi.in/",
  },
  {
    title: "Saraswathi Rubbers",
    description:
      "Responsive website showcasing crumb rubber, EPDM granules, and tyre wire.",
    link: "https://saraswathirubbers.com/",
  },
  {
    title: "Vikahrubbers",
    description:
      "Custom rubber manufacturing solutions website with clean UI and smooth navigation.",
    link: "https://vikahrubbers.com/",
  },
  {
    title: "Diabetes Prediction",
    description:
      "Python ML project to predict diabetes using health data for early diagnosis.",
    link: "#",
  },
  {
    title: "Exam Cell System",
    description:
      "SQL-powered academic management system for student performance tracking.",
    link: "#",
  },
];

const Projects = () => {
  const mainProjects = projects.slice(0, projects.length - 2);
  const academicProjects = projects.slice(projects.length - 2);

  return (
    <section className={styles.projectsSection}>
      <Container fluid="lg">
        <h2 className={styles.heading}>Projects</h2>

        <div className={styles.projectsGrid}>
          {mainProjects.map((project, index) => (
            <article key={index} className={styles.projectCard}>
              <div className={styles.cardInner}>
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <p className={styles.projectDesc}>{project.description}</p>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.projectButton}
                >
                  Visit Site
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className={styles.academicSection}>
          <h3 className={styles.academicHeading}>Academic Projects</h3>
          <div className={styles.academicGrid}>
            {academicProjects.map((project, index) => (
              <article key={index} className={styles.projectCard}>
                <div className={styles.cardInner}>
                  <h4 className={styles.projectTitle}>{project.title}</h4>
                  <p className={styles.projectDesc}>{project.description}</p>
                  <a href={project.link} className={styles.projectButton}>
                    View
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Projects;
