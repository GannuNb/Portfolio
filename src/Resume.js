// src/components/Resume/Resume.jsx
import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import styles from "./Resume.module.css";

/*
  Approach:
  - For PDF: clone the resume DOM, add a "print-ready" class (fixed desktop width / two columns),
    append the clone off-screen, run html2canvas on the clone, then remove the clone.
  - This keeps on-screen responsive behavior for mobile while producing desktop-like PDF layout.
*/

export default function Resume() {
  const resumeRef = useRef(null);
  const [loading, setLoading] = useState(false);

  // A4 sizes (points)
  const A4_WIDTH_PTS = 595.28;
  const A4_HEIGHT_PTS = 841.89;

  // Canvas scale for high-def
  const CANVAS_SCALE = 4;

  // selectors for contact link elements (data-pdf-link attributes)
  const contactLinkSelectors = [
    '[data-pdf-link="kadiri"]',
    '[data-pdf-link="github"]',
    '[data-pdf-link="mail"]',
    '[data-pdf-link="phone"]',
    '[data-pdf-link="portfolio"]',
    '[data-pdf-link="linkedin"]',
  ];

  const generatePdfWithLinks = async ({ openInNewTab = true } = {}) => {
    if (!resumeRef.current) return;
    setLoading(true);

    // We'll operate on a clone that forces desktop layout so PDF looks like desktop.
    let cloneContainer = null;
    let cloneRoot = null;

    try {
      // ensure webfonts are ready (improves canvas text rendering)
      if (document.fonts && document.fonts.ready) await document.fonts.ready;
      await new Promise((r) => setTimeout(r, 80));

      // create clone and force print-ready desktop width
      cloneRoot = resumeRef.current.cloneNode(true);

      // add helper class to force desktop two-column layout
      cloneRoot.classList.add(styles.printReady || "print-ready"); // fall back if CSS module naming differs

      // ensure the clone's inline style forces the width used for PDF rendering
      cloneRoot.style.width = "980px";
      cloneRoot.style.maxWidth = "980px";
      cloneRoot.style.boxSizing = "border-box";

      // append off-screen container
      cloneContainer = document.createElement("div");
      cloneContainer.style.position = "fixed";
      cloneContainer.style.left = "-10000px"; // off-screen
      cloneContainer.style.top = "0";
      cloneContainer.style.width = "980px";
      cloneContainer.style.overflow = "hidden";
      cloneContainer.appendChild(cloneRoot);
      document.body.appendChild(cloneContainer);

      // small delay to ensure layout recalculation
      await new Promise((r) => requestAnimationFrame(r));

      // Render clone to canvas
      const canvas = await html2canvas(cloneRoot, {
        scale: CANVAS_SCALE,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        imageTimeout: 20000,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: cloneRoot.scrollWidth,
        windowHeight: cloneRoot.scrollHeight,
      });

      // disable smoothing for crisp result
      const mainCtx = canvas.getContext && canvas.getContext("2d");
      if (mainCtx) mainCtx.imageSmoothingEnabled = false;

      const canvasWidthPx = canvas.width;
      const canvasHeightPx = canvas.height;

      // px per PDF point
      const pxPerPt = canvasWidthPx / A4_WIDTH_PTS;
      const a4HeightPx = Math.floor(A4_HEIGHT_PTS * pxPerPt);

      // Create jsPDF doc in 'pt' units A4
      const pdf = new jsPDF({ unit: "pt", format: "a4" });

      // Gather link elements and their href + bounding rect relative to cloneRoot
      const linkEntries = [];
      for (const sel of contactLinkSelectors) {
        const el = cloneRoot.querySelector(sel);
        if (!el) continue;
        const rootRect = cloneRoot.getBoundingClientRect();
        const rect = el.getBoundingClientRect();
        const leftDomPx = rect.left - rootRect.left;
        const topDomPx = rect.top - rootRect.top;
        const widthDomPx = rect.width;
        const heightDomPx = rect.height;
        const href = el.getAttribute("href");
        if (!href) continue;
        linkEntries.push({
          href,
          leftDomPx,
          topDomPx,
          widthDomPx,
          heightDomPx,
        });
      }

      // helpful converter: canvas px -> PDF pts
      const canvasPxToPdfPts = (px) => px / pxPerPt;

      // iterate slices/pages
      let yOffsetCanvasPx = 0;
      let pageIndex = 0;
      while (yOffsetCanvasPx < canvasHeightPx) {
        const sliceHeightCanvasPx = Math.min(a4HeightPx, canvasHeightPx - yOffsetCanvasPx);

        // create slice canvas and draw slice
        const sliceCanvas = document.createElement("canvas");
        sliceCanvas.width = canvasWidthPx;
        sliceCanvas.height = sliceHeightCanvasPx;
        const sCtx = sliceCanvas.getContext("2d");
        if (sCtx) sCtx.imageSmoothingEnabled = false;
        sCtx.drawImage(
          canvas,
          0,
          yOffsetCanvasPx,
          canvasWidthPx,
          sliceHeightCanvasPx,
          0,
          0,
          canvasWidthPx,
          sliceHeightCanvasPx
        );

        const dataUrl = sliceCanvas.toDataURL("image/png");

        // compute image height in PDF pts
        const imgWidthPts = A4_WIDTH_PTS;
        const imgHeightPts = canvasPxToPdfPts(sliceHeightCanvasPx);

        // add or select page
        if (pageIndex === 0) {
          pdf.setPage(1);
        } else {
          pdf.addPage();
          pdf.setPage(pageIndex + 1);
        }

        pdf.addImage(dataUrl, "PNG", 0, 0, imgWidthPts, imgHeightPts, undefined, "FAST");

        // Add link annotations that intersect this slice
        for (const entry of linkEntries) {
          // DOM px -> canvas px (clone was rendered at CANVAS_SCALE)
          const entryTopCanvasPx = entry.topDomPx * CANVAS_SCALE;
          const entryBottomCanvasPx = (entry.topDomPx + entry.heightDomPx) * CANVAS_SCALE;
          const entryLeftCanvasPx = entry.leftDomPx * CANVAS_SCALE;
          const entryWidthCanvasPx = entry.widthDomPx * CANVAS_SCALE;
          const entryHeightCanvasPx = entry.heightDomPx * CANVAS_SCALE;

          const sliceTopCanvasPx = yOffsetCanvasPx;
          const sliceBottomCanvasPx = yOffsetCanvasPx + sliceHeightCanvasPx;

          // if entry outside slice skip
          if (entryBottomCanvasPx <= sliceTopCanvasPx || entryTopCanvasPx >= sliceBottomCanvasPx) {
            continue;
          }

          // visible portion inside slice (canvas px)
          const visibleTopCanvasPx = Math.max(entryTopCanvasPx, sliceTopCanvasPx);
          const visibleBottomCanvasPx = Math.min(entryBottomCanvasPx, sliceBottomCanvasPx);
          const visibleHeightCanvasPx = visibleBottomCanvasPx - visibleTopCanvasPx;

          // left and top within slice (canvas px)
          const leftCanvasPx = entryLeftCanvasPx;
          const visibleTopWithinSliceCanvasPx = visibleTopCanvasPx - sliceTopCanvasPx;

          // convert to PDF pts
          const pdfX = canvasPxToPdfPts(leftCanvasPx);
          const pdfY = canvasPxToPdfPts(visibleTopWithinSliceCanvasPx);
          const pdfW = canvasPxToPdfPts(entryWidthCanvasPx);
          const pdfH = canvasPxToPdfPts(visibleHeightCanvasPx);

          if (pdfW > 0 && pdfH > 0 && entry.href) {
            try {
              pdf.link(pdfX, pdfY, pdfW, pdfH, { url: entry.href });
            } catch (err) {
              // some viewers or older jsPDF builds may throw for link creation; ignore and continue
              // console.warn("Could not add link:", err);
            }
          }
        }

        // next slice
        yOffsetCanvasPx += sliceHeightCanvasPx;
        pageIndex += 1;
      }

      // Output PDF
      if (openInNewTab) {
        const blob = pdf.output("blob");
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
      } else {
        pdf.save("Ganesh_Resume.pdf");
      }
    } catch (err) {
      console.error("PDF generation error:", err);
      alert("Could not generate PDF. See console for details.");
    } finally {
      // clean up clone
      if (cloneContainer && cloneContainer.parentNode) {
        cloneContainer.parentNode.removeChild(cloneContainer);
      }
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <h3 className={styles.previewTitle}>Resume </h3>
        <div className={styles.controls}>
          <button
            className={styles.primaryBtn}
            onClick={() => generatePdfWithLinks({ openInNewTab: true })}
            disabled={loading}
          >
            {loading ? "Generating..." : "Open Pdf"}
          </button>
          <button
            className={styles.secondaryBtn}
            onClick={() => generatePdfWithLinks({ openInNewTab: false })}
            disabled={loading}
          >
            {loading ? "Generating..." : "Download PDF"}
          </button>
        </div>
      </div>

      <div className={styles.previewWrap}>
        <div ref={resumeRef} className={styles.resumeCard}>
          {/* header */}
          <div className={styles.header}>
            <div className={styles.nameSection}>
              <div className={styles.nameRow}>
                <span className={styles.firstName}>Ganesh</span>
                <span className={styles.lastName}>Nallabapineneni</span>
              </div>
              <div className={styles.title}>Software Engineer</div>

              {/* contact row with data-pdf-link attributes */}
              <div className={styles.contactRow} title="Contact row">
                <a
                  className={styles.contactItem}
                  href="https://maps.google.com?q=Kadiri"
                  data-pdf-link="kadiri"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className={styles.icon} dangerouslySetInnerHTML={{ __html: homeSvg }} />
                  <span className={styles.contactLabel}>Kadiri</span>
                </a>

                <a
                  className={styles.contactItem}
                  href="https://github.com/GannuNb"
                  data-pdf-link="github"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className={styles.icon} dangerouslySetInnerHTML={{ __html: githubSvg }} />
                  <span className={styles.contactLabel}>GitHub</span>
                </a>

                <a
                  className={styles.contactItem}
                  href="mailto:nbganesh1818@gmail.com"
                  data-pdf-link="mail"
                >
                  <span className={styles.icon} dangerouslySetInnerHTML={{ __html: mailSvg }} />
                  <span className={styles.contactLabel}>nbganesh1818@gmail.com</span>
                </a>
                <a
                  className={styles.contactItem}
                  href="https://www.linkedin.com/in/ganesh-nallabapineni-05113826b/"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-pdf-link="linkedin"
                >
                  <span
                    className={styles.icon}
                    dangerouslySetInnerHTML={{ __html: linkedinSvg }}
                  />
                  <span className={styles.contactLabel}>
                    Ganesh Nallabapineni
                  </span>
                </a>

                <a
                  className={styles.contactItem}
                  href="tel:+919346481093"
                  data-pdf-link="phone"
                >
                  <span className={styles.icon} dangerouslySetInnerHTML={{ __html: phoneSvg }} />
                  <span className={styles.contactLabel}>+91 9346481093</span>
                </a>

                <a
                  className={styles.portfolioLink}
                  href="https://ganesh-eta.vercel.app/"
                  data-pdf-link="portfolio"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className={styles.portfolioIcon} dangerouslySetInnerHTML={{ __html: portfolioSvg }} />
                  Portfolio
                </a>
              </div>
            </div>
          </div>

          {/* body */}
          <div className={styles.body}>
            <div className={styles.leftCol}>
              <h4 className={styles.sectionTitle}>Experience</h4>

              <Job
                company="VIKAH ECOTECH"
                role="Full Stack Developer and UI/UX Designer"
                date="June 2024 - Present | Nagole, Hyderabad"
                bullets={[
                  "Developed and maintained web applications using the MERN stack, enhancing business capabilities.",
                  "Designed intuitive user interfaces using Figma, focusing on visual aesthetics and user experience.",
                  "Collaborated with teams to create scalable features and improve overall usability.",
                  "Implemented RESTful APIs to ensure efficient data exchange between front-end and back-end.",
                  "Participated in Agile processes, contributing to team collaboration and project success.",
                ]}
              />

              <Job
                company="MAANG TECHNOLOGIES PVT LTD"
                role="UI/UX Designer, Frontend Developer and Selenium Testing"
                date="March 2023 - March 2024 | Hyderabad"
                bullets={[
                  "Designed user interfaces using Figma, creating visually appealing and user-friendly designs for web applications",
                  "Developed responsive front-end components and dynamic user interfaces with React.js, HTML, CSS, and JavaScript",
                  "Conducted Selenium testing to ensure application functionality and compatibility across multiple browsers and devices.",
                  "Collaborated with cross-functional teams to align design and development efforts,ensuring cohesive product delivery."
                ]}
              />

              <h4 className={styles.sectionTitle}>Industrial Projects</h4>
              <Project
                title="Recycling Machinery Platform  (vikahecotech.com)"
                desc="Developed a web platform with React.js and Node.js for Vikah Ecotech enabling easy selection of recycling machinery and supporting sustainability goals."
                link="https://vikahecotech.com"
              />
              <Project
                title="Rubberscrapmart — Marketplace (rubberscrapmarket.com)"
                desc="Developed a full-stack e-commerce marketplace for buying and selling rubberscrap materials, integrating product listing, order management, and shipment tracking features."
                link="https://rubberscrapmart.com"
              />
              <Project
                title="Lavarubberllc — Scrap Trading (lavarubberllc.com)"
                desc="Built a full-stack platform for trading Ferrous, Non-Ferrous, and Tyre Scrap, enabling easy product browsing and purchasing. Buyers and suppliers can also manage container products on the site."
                link="https://lavarubberllc.com"
              />
              <Project
                title="LG Industry — Industrial Materials (lgindustry.in)"
                desc="Built a responsive web platform showcasing products like Crumb Rubber, EPDM Granules, and Tyre Wire, designed for user-friendly navigation and seamless product inquiries."
                link="https://lgindustry.in"
              />
              <Project
                title="Diabetes Prediction System"
                desc="Built a Scikit-learn model to predict diabetes risk with 87 percent accuracy using medical features."
              />
            </div>

            <aside className={styles.rightCol}>
              <div className={styles.box}>
                <h5 className={styles.boxTitle}>Skills</h5>

                <div className={styles.kv}>
                  <div className={styles.kKey}>Programming</div>
                  <div className={styles.kVal}>
                    HTML, CSS, JavaScript, Python, SQL, MongoDB <br />
                    Data Structures & Algorithms
                  </div>
                </div>

                <div className={styles.kv}>
                  <div className={styles.kKey}>Design</div>
                  <div className={styles.kVal}>
                    UI/UX – Figma, Canva, Adobe XD
                  </div>
                </div>

                <div className={styles.kv}>
                  <div className={styles.kv}>
                    <div className={styles.kKey}>Frameworks</div>
                    <div className={styles.kVal}>
                      Bootstrap, React.js, Node.js, jQuery
                    </div>
                  </div>

                  <div className={styles.kv}>
                    <div className={styles.kKey}>Libraries / Technologies</div>
                    <div className={styles.kVal}>
                      NumPy, Pandas, Matplotlib, Seaborn, <br />
                      Scikit-learn, TensorFlow, Keras <br />
                      AI, ML, DL
                    </div>
                  </div>
                </div>

                <div className={styles.kv}>
                  <div className={styles.kKey}>Tools / Platforms</div>
                  <div className={styles.kVal}>
                    Git, GitHub, Hostinger, SEO, Selenium
                  </div>
                </div>
              </div>

              <div className={styles.box}>
                <h5 className={styles.boxTitle}>Education</h5>

                <div className={styles.eduItem}>
                  <div className={styles.eduName}>AP IIIT RGUKT RK VALLEY</div>
                  <div className={styles.eduMeta}>B.Tech (CSE) — 2020-2024</div>
                  <div className={styles.eduMeta}>CGPA: 8.1</div>
                </div>

                <div className={styles.eduItem}>
                  <div className={styles.eduName}>PUC (M.P.C)</div>
                  <div className={styles.eduMeta}>2018-2020</div>
                  <div className={styles.eduMeta}>CGPA: 8.6</div>
                </div>

                <div className={styles.eduItem}>
                  <div className={styles.eduName}>SSC – Govt High School Main, Pulivendula</div>
                  <div className={styles.eduMeta}>CGPA: 9.8</div>
                </div>
              </div>

              <div className={styles.box}>
                <h5 className={styles.boxTitle}>About Me</h5>
                <div className={styles.about}>Full Stack Developer
                  specializing in the MERN stack,
                  building scalable and
                  user-friendly web applications
                  with strong frontend, backend,
                  and UI/UX skills. I use AI/ML
                  when helpful and enjoy
                  creating efficient solutions.</div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

/* helper components and SVGs */
function Job({ company, role, date, bullets = [] }) {
  return (
    <div className={styles.job}>
      <div className={styles.jobHeader}>
        <div className={styles.jobCompanyWrap}>
          <div className={styles.jobCompany} title={company}>{company}</div>
        </div>
        <div className={styles.jobDate}>{date}</div>
      </div>
      <div className={styles.jobRole}>{role}</div>
      <ul className={styles.jobBullets}>
        {bullets.map((b, i) => <li key={i}>{b}</li>)}
      </ul>
    </div>
  );
}

function Project({ title, desc, link }) {
  return (
    <div className={styles.project}>
      {link ? (
        <div className={styles.projectTitle}>
          <a href={link} target="_blank" rel="noreferrer">{title}</a>
        </div>
      ) : (
        <div className={styles.projectTitle}>{title}</div>
      )}
      <div className={styles.projectDesc}>{desc}</div>
    </div>
  );
}

/* inline SVGs (same as yours) */
const homeSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 11.5L12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V11.5z" stroke="#0b63d6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const githubSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C7.58 2 4 5.58 4 10c0 3.54 2.29 6.54 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2 .37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.2 1.87.86 2.33.66.07-.52.28-.86.51-1.06-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.22 2.2.82A7.6 7.6 0 0112 6.8c.68.003 1.36.092 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0020 10c0-4.42-3.58-8-8-8z" stroke="#0b63d6" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const mailSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 7.5v9A2.5 2.5 0 005.5 19h13A2.5 2.5 0 0021 16.5v-9A2.5 2.5 0 0018.5 5h-13A2.5 2.5 0 003 7.5z" stroke="#0b63d6" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 7.5l-9 6-9-6" stroke="#0b63d6" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const phoneSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 013 5.18 2 2 0 015 3h3a2 2 0 0 1 2 1.72c.12 1.05.38 2.07.78 3.03a2 2 0 0 1-.45 2.11L9.91 11.91a16 16 0 0 0 6.09 6.09l1.05-1.05a2 2 0 0 1 2.11-.45c.96.4 1.98.66 3.03.78A2 2 0 0 1 22 16.92z" stroke="#0b63d6" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const portfolioSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 7h18M5 7v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7" stroke="#0b63d6" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 7V5a3 3 0 0 1 6 0v2" stroke="#0b63d6" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const linkedinSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5zM3 9h4v12H3V9zm7 0h3.6v1.71h.05A3.95 3.95 0 0 1 17.5 9c3.03 0 4.5 1.94 4.5 5.36V21h-4v-6.1c0-1.45-.03-3.31-2.02-3.31-2.02 0-2.33 1.58-2.33 3.21V21h-4V9z"
stroke="#0b63d6" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
