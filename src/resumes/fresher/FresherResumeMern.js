import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import styles from "./FresherResume.module.css";

export default function FresherResumeMern() {
  const resumeRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const A4_WIDTH_PTS = 595.28;
  const A4_HEIGHT_PTS = 841.89;
  const CANVAS_SCALE = 4;

  const contactLinkSelectors = [
    '[data-pdf-link="kadiri"]',
    '[data-pdf-link="github"]',
    '[data-pdf-link="mail"]',
    '[data-pdf-link="phone"]',
    '[data-pdf-link="linkedin"]',
  ];

  const generatePdfWithLinks = async ({ openInNewTab = true } = {}) => {
    if (!resumeRef.current) return;

    setLoading(true);

    let cloneContainer = null;
    let cloneRoot = null;

    try {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      await new Promise((r) => setTimeout(r, 80));

      cloneRoot = resumeRef.current.cloneNode(true);

      cloneRoot.classList.add(styles.printReady || "print-ready");

      cloneRoot.style.width = "980px";
      cloneRoot.style.maxWidth = "980px";
      cloneRoot.style.boxSizing = "border-box";

      cloneContainer = document.createElement("div");

      cloneContainer.style.position = "fixed";
      cloneContainer.style.left = "-10000px";
      cloneContainer.style.top = "0";
      cloneContainer.style.width = "980px";

      cloneContainer.appendChild(cloneRoot);

      document.body.appendChild(cloneContainer);

      await new Promise((r) => requestAnimationFrame(r));

      const canvas = await html2canvas(cloneRoot, {
        scale: CANVAS_SCALE,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        imageTimeout: 20000,
        allowTaint: true,
      });

      const canvasWidthPx = canvas.width;
      const canvasHeightPx = canvas.height;

      const pxPerPt = canvasWidthPx / A4_WIDTH_PTS;

      const a4HeightPx = Math.floor(A4_HEIGHT_PTS * pxPerPt);

      const pdf = new jsPDF({
        unit: "pt",
        format: "a4",
      });

      const linkEntries = [];

      for (const sel of contactLinkSelectors) {
        const el = cloneRoot.querySelector(sel);

        if (!el) continue;

        const rootRect = cloneRoot.getBoundingClientRect();
        const rect = el.getBoundingClientRect();

        const href = el.getAttribute("href");

        if (!href) continue;

        linkEntries.push({
          href,
          leftDomPx: rect.left - rootRect.left,
          topDomPx: rect.top - rootRect.top,
          widthDomPx: rect.width,
          heightDomPx: rect.height,
        });
      }

      const canvasPxToPdfPts = (px) => px / pxPerPt;

      let yOffsetCanvasPx = 0;
      let pageIndex = 0;

      while (yOffsetCanvasPx < canvasHeightPx) {
        const sliceHeightCanvasPx = Math.min(
          a4HeightPx,
          canvasHeightPx - yOffsetCanvasPx,
        );

        const sliceCanvas = document.createElement("canvas");

        sliceCanvas.width = canvasWidthPx;
        sliceCanvas.height = sliceHeightCanvasPx;

        const sCtx = sliceCanvas.getContext("2d");

        sCtx.drawImage(
          canvas,
          0,
          yOffsetCanvasPx,
          canvasWidthPx,
          sliceHeightCanvasPx,
          0,
          0,
          canvasWidthPx,
          sliceHeightCanvasPx,
        );

        const dataUrl = sliceCanvas.toDataURL("image/png");

        const imgWidthPts = A4_WIDTH_PTS;
        const imgHeightPts = canvasPxToPdfPts(sliceHeightCanvasPx);

        if (pageIndex !== 0) {
          pdf.addPage();
        }

        pdf.addImage(dataUrl, "PNG", 0, 0, imgWidthPts, imgHeightPts);

        for (const entry of linkEntries) {
          const entryTopCanvasPx = entry.topDomPx * CANVAS_SCALE;

          const entryBottomCanvasPx =
            (entry.topDomPx + entry.heightDomPx) * CANVAS_SCALE;

          const sliceTopCanvasPx = yOffsetCanvasPx;

          const sliceBottomCanvasPx = yOffsetCanvasPx + sliceHeightCanvasPx;

          if (
            entryBottomCanvasPx <= sliceTopCanvasPx ||
            entryTopCanvasPx >= sliceBottomCanvasPx
          ) {
            continue;
          }

          const pdfX = canvasPxToPdfPts(entry.leftDomPx * CANVAS_SCALE);

          const pdfY = canvasPxToPdfPts(entryTopCanvasPx - sliceTopCanvasPx);

          const pdfW = canvasPxToPdfPts(entry.widthDomPx * CANVAS_SCALE);

          const pdfH = canvasPxToPdfPts(entry.heightDomPx * CANVAS_SCALE);

          pdf.link(pdfX, pdfY, pdfW, pdfH, {
            url: entry.href,
          });
        }

        yOffsetCanvasPx += sliceHeightCanvasPx;
        pageIndex += 1;
      }

      if (openInNewTab) {
        const blob = pdf.output("blob");
        const url = URL.createObjectURL(blob);

        window.open(url, "_blank");
      } else {
        pdf.save("Ganesh_Fresher_Resume.pdf");
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (cloneContainer && cloneContainer.parentNode) {
        cloneContainer.parentNode.removeChild(cloneContainer);
      }

      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <h3 className={styles.previewTitle}>Fresher Resume</h3>

        <div className={styles.controls}>
          <button
            className={styles.primaryBtn}
            onClick={() =>
              generatePdfWithLinks({
                openInNewTab: true,
              })
            }
            disabled={loading}
          >
            {loading ? "Generating..." : "Open PDF"}
          </button>

          <button
            className={styles.secondaryBtn}
            onClick={() =>
              generatePdfWithLinks({
                openInNewTab: false,
              })
            }
            disabled={loading}
          >
            {loading ? "Generating..." : "Download PDF"}
          </button>
        </div>
      </div>

      <div className={styles.previewWrap}>
        <div ref={resumeRef} className={styles.resumeCard}>
          {/* HEADER */}
          <div className={styles.header}>
            <div className={styles.nameSection}>
              <div className={styles.nameRow}>
                <span className={styles.firstName}>Ganesh</span>

                <span className={styles.lastName}>Nallabapineni</span>
              </div>

              <div className={styles.title}>Full Stack MERN Developer</div>

              {/* CONTACT ROW */}
              <div className={styles.contactRow} title="Contact row">
                <a
                  className={styles.contactItem}
                  href="https://maps.google.com?q=Kadiri"
                  data-pdf-link="kadiri"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span
                    className={styles.icon}
                    dangerouslySetInnerHTML={{
                      __html: homeSvg,
                    }}
                  />

                  <span className={styles.contactLabel}>Kadiri</span>
                </a>

                <a
                  className={styles.contactItem}
                  href="https://github.com/GannuNb"
                  data-pdf-link="github"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span
                    className={styles.icon}
                    dangerouslySetInnerHTML={{
                      __html: githubSvg,
                    }}
                  />

                  <span className={styles.contactLabel}>GitHub</span>
                </a>

                <a
                  className={styles.contactItem}
                  href="mailto:nbganesh1818@gmail.com"
                  data-pdf-link="mail"
                >
                  <span
                    className={styles.icon}
                    dangerouslySetInnerHTML={{
                      __html: mailSvg,
                    }}
                  />

                  <span className={styles.contactLabel}>
                    nbganesh1818@gmail.com
                  </span>
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
                    dangerouslySetInnerHTML={{
                      __html: linkedinSvg,
                    }}
                  />

                  <span className={styles.contactLabel}>Ganesh</span>
                </a>

                <a
                  className={styles.contactItem}
                  href="tel:+919346481093"
                  data-pdf-link="phone"
                >
                  <span
                    className={styles.icon}
                    dangerouslySetInnerHTML={{
                      __html: phoneSvg,
                    }}
                  />

                  <span className={styles.contactLabel}>9346481093</span>
                </a>
              </div>
            </div>
          </div>

          {/* BODY */}
          <div className={styles.body}>
            {/* LEFT COLUMN */}
            <div className={styles.leftCol}>
              <h4 className={styles.sectionTitle}>Experience</h4>

              <Job
                company="VIKAH ECOTECH"
                role="Full Stack Developer"
                date="April 2026 - Current | Nagole, Hyderabad"
                bullets={[
                  "Developed and maintained 4+ high-performance web applications using the MERN stack, significantly enhancing business capabilities.",
                  "Designed intuitive user interfaces using Figma, focusing on visual aesthetics and user experience.",
                  "Collaborated with teams to create scalable features and improve overall usability.",
                  "Implemented RESTful APIs to ensure efficient data exchange between front-end and back-end.",
                  "Participated in Agile processes, contributing to team collaboration and project success.",
                ]}
              />

              <h4 className={styles.sectionTitle}>Projects</h4>

              <Project
                title="RECYCLING MACHINERY PLATFORM (vikahecotech.com) | REACT JS"
                desc={
                  <>
                    <ul className={styles.jobBullets}>
                      <li>
                        Developed a web platform with React.js for Vikah Ecotech
                        enabling easy selection of recycling machinery and
                        supporting sustainability goals.
                      </li>

                      <li>
                        Implemented reusable React components with optimized
                        performance to ensure fast navigation and a smooth user
                        experience across the platform.
                      </li>
                    </ul>
                  </>
                }
                link="https://vikahecotech.com"
              />

              <Project
                title="RUBBERSCRAPMART - MARKETPLACE (rubberscrapmart.com) | MERN STACK"
                desc={
                  <>
                    <ul className={styles.jobBullets}>
                      <li>
                        Developed a full-stack multi-role e-commerce marketplace
                        for rubber scrap trading, enabling seamless interaction
                        between buyers, sellers, transporters, and
                        administrators within a single platform.
                      </li>

                      <li>
                        Built role-based dashboards for each user type: sellers
                        can list and manage scrap products, buyers can browse
                        and place orders, transporters handle logistics and
                        delivery tracking, and admins oversee platform
                        operations.
                      </li>

                      <li>
                        Implemented core features including product listing with
                        images and pricing, secure authentication, order
                        lifecycle management, and real-time shipment status
                        updates.
                      </li>

                      <li>
                        Designed and integrated an efficient backend API
                        architecture using Node.js and Express.js with MongoDB
                        for scalable data management across multiple user roles
                        and transactions.
                      </li>
                    </ul>
                  </>
                }
                link="https://rubberscrapmart.com"
              />

              <Project
                title="LAVARUBBERLLC — SCRAP TRADING (lavarubberllc.com) | MERN STACK"
                desc={
                  <>
                    <ul className={styles.jobBullets}>
                      <li>
                        Built a full-stack platform for trading Ferrous,
                        Non-Ferrous, and Tyre Scrap, enabling easy product
                        browsing and purchasing. Buyers and suppliers can also
                        manage container products on the site.
                      </li>
                    </ul>
                  </>
                }
                link="https://lavarubberllc.com"
              />
            </div>

            {/* RIGHT COLUMN */}
            <aside className={styles.rightCol}>
              <div className={styles.box}>
                <h5 className={styles.boxTitle}>Skills</h5>

                <div className={styles.kv}>
                  <div className={styles.kKey}>Programming</div>

                  <div className={styles.kVal}>HTML, CSS, JavaScript</div>
                </div>

                <div className={styles.kv}>
                  <div className={styles.kKey}>Frameworks</div>

                  <div className={styles.kVal}>
                    React.js, Bootstrap, Express.js, React Native
                  </div>
                </div>

                <div className={styles.kv}>
                  <div className={styles.kKey}>Backend</div>

                  <div className={styles.kVal}>Node.js</div>
                </div>

                <div className={styles.kv}>
                  <div className={styles.kKey}>Database</div>

                  <div className={styles.kVal}>MongoDB</div>
                </div>

                <div className={styles.kv}>
                  <div className={styles.kKey}>UI/UX (Design)</div>

                  <div className={styles.kVal}>Figma, Canva</div>
                </div>

                <div className={styles.kv}>
                  <div className={styles.kKey}>Tools / Platforms</div>

                  <div className={styles.kVal}>
                    Git, GitHub, Hostinger, SEO Tools
                  </div>
                </div>

                <div className={styles.kv}>
                  <div className={styles.kKey}>Familiar With</div>

                  <div className={styles.kVal}>
                    TypeScript, Next.js, Tailwind CSS
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
                  <div className={styles.eduName}>
                    SSC – Govt High School Main
                  </div>

                  <div className={styles.eduMeta}>Pulivendula</div>

                  <div className={styles.eduMeta}>CGPA: 9.8</div>
                </div>
              </div>

              <div className={styles.box}>
                <h5 className={styles.boxTitle}>Profile Summary</h5>

                <div className={styles.about}>
                  Full Stack Developer specializing in the MERN stack, building
                  scalable and responsive web applications. Skilled in frontend
                  and backend development with experience in Next.js and React
                  Native for modern cross-platform solutions.
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

function Job({ company, role, date, bullets = [] }) {
  return (
    <div className={styles.job}>
      <div className={styles.jobHeader}>
        <div className={styles.jobCompanyWrap}>
          <div className={styles.jobCompany} title={company}>
            {company}
          </div>
        </div>

        <div className={styles.jobDate}>{date}</div>
      </div>

      <div className={styles.jobRole}>{role}</div>

      <ul className={styles.jobBullets}>
        {bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    </div>
  );
}

function Project({ title, desc, link }) {
  return (
    <div className={styles.project}>
      {link ? (
        <div className={styles.projectTitle}>
          <a href={link} target="_blank" rel="noreferrer">
            {title}
          </a>
        </div>
      ) : (
        <div className={styles.projectTitle}>{title}</div>
      )}

      <div className={styles.projectDesc}>{desc}</div>
    </div>
  );
}

const homeSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 11.5L12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V11.5z" stroke="#0b63d6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const githubSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C7.58 2 4 5.58 4 10c0 3.54 2.29 6.54 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2 .37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.2 1.87.86 2.33.66.07-.52.28-.86.51-1.06-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.22 2.2.82A7.6 7.6 0 0112 6.8c.68.003 1.36.092 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0020 10c0-4.42-3.58-8-8-8z" stroke="#0b63d6" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const mailSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 7.5v9A2.5 2.5 0 005.5 19h13A2.5 2.5 0 0021 16.5v-9A2.5 2.5 0 0018.5 5h-13A2.5 2.5 0 003 7.5z" stroke="#0b63d6" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 7.5l-9 6-9-6" stroke="#0b63d6" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const phoneSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 013 5.18 2 2 0 015 3h3a2 2 0 0 1 2 1.72c.12 1.05.38 2.07.78 3.03a2 2 0 0 1-.45 2.11L9.91 11.91a16 16 0 0 0 6.09 6.09l1.05-1.05a2 2 0 0 1 2.11-.45c.96.4 1.98.66 3.03.78A2 2 0 0 1 22 16.92z" stroke="#0b63d6" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const linkedinSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5zM3 9h4v12H3V9zm7 0h3.6v1.71h.05A3.95 3.95 0 0 1 17.5 9c3.03 0 4.5 1.94 4.5 5.36V21h-4v-6.1c0-1.45-.03-3.31-2.02-3.31-2.02 0-2.33 1.58-2.33 3.21V21h-4V9z" stroke="#0b63d6" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
