import React, { useState, useEffect, useRef } from "react";
import "../main.scss";
import { gsap } from "gsap";
import { revealOnScroll, prefersReducedMotion } from "../utils/scrollReveal";

const projectsPerPage = 2;
// Matches .project-img's actual rendered width (see _projects.scss): the
// image is 100% of its container, but the container itself has padding at
// phone widths, so it never actually reaches 100vw - measured 80-86vw
// across real phone widths (320-600px). 85vw stays safely on the generous
// side of that range (never picks a source too small to look sharp) while
// still telling the browser the truth instead of the old "100vw", which
// was causing it to fetch a needlessly large srcset candidate. ~34% of
// the container above the phone breakpoint.
const PROJECT_IMAGE_SIZES = "(max-width: 37.5em) 85vw, 34vw";

function Projects({ _data }) {
  const h2 = useRef(null);
  const proj = useRef(null);
  const projectsArr = useRef([]);
  const projectImagesArr = useRef([]);
  const imageCopyRun = useRef(false);
  const start = useRef(0);
  const finish = useRef(0);
  const preloadLinks = useRef([]);
  const revealedCount = useRef(0);

  const preloadImage = (end) => {
    return (() => {
      if (!imageCopyRun.current) {
        imageCopyRun.current = true;
        start.current = 0;
        finish.current = end *= 2;
        _data.projects.forEach((p) => {
          projectImagesArr.current.push(p.images);
        });
      }

      for (let i = start.current; i < projectImagesArr.current.length; i++) {
        if (i < finish.current) {
          const images = projectImagesArr.current[i];
          let link = document.createElement("link");
          link.rel = "preload";
          link.as = "image";
          link.href = images.phone.img;
          link.imageSrcset = `${images.phone.img} 480w, ${images.phoneLarge.img} 640w, ${images.tablet.img} 800w, ${images.desctop.img} 1200w`;
          link.imageSizes = PROJECT_IMAGE_SIZES;

          document.head.appendChild(link);
          preloadLinks.current.push(link);
        }
      }

      start.current = finish.current;
      finish.current = finish.current + 2; // by two
    })();
  };

  const projects = _data.projects.map((item, index) => {
    // Only the first page (visible on mount) should be eager; every
    // project after that — including everything pulled in later via
    // "Load more" — is off-screen when it renders, so it should be lazy.
    const loading = index < projectsPerPage ? "eager" : "lazy";
    return (
      <div className="projects__main--project" key={item.title}>
        <div className="project-img">
          <a className="project-img--link" href={item.url ? item.url : item.urlGit} target="_blank" rel="noreferrer" aria-label={item.description}>
            <img
              width="640"
              height="360"
              src={item.images.phone.img}
              srcSet={`${item.images.phone.img} 480w, ${item.images.phoneLarge.img} 640w, ${item.images.tablet.img} 800w, ${item.images.desctop.img} 1200w`}
              sizes={PROJECT_IMAGE_SIZES}
              alt={item.description}
              loading={loading}
            />
          </a>
        </div>
        <div className="project-desc">
          <h3 className="heading-desc-title" ref={h2}>
            {item.title}
          </h3>
          <h4 className="heading-sub-title">{item.using}</h4>
          <p className="paragraph">{item.description}</p>
          {item.urlGit !== "" ? (
            <a
              className="btn"
              target="_blank"
              rel="noreferrer"
              href={item.urlGit}
              aria-label={`View source for ${item.title}`}
            >
              View source
            </a>
          ) : null}
          {item.url !== "" ? (
            <a
              className="btn"
              target="_blank"
              rel="noreferrer"
              href={item.url}
              aria-label={`Try ${item.title} live`}
            >
              Try it Live
            </a>
          ) : null}
        </div>
      </div>
    );
  });

  const [projectsToShow, setProjectsToShow] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const ref = useRef(projectsPerPage);

  const loopProjects = (sliceStart, sliceEnd) => {
    preloadImage(sliceEnd);
    const sliceProjects = projects.slice(sliceStart, sliceEnd);
    projectsArr.current = projectsArr.current.concat(sliceProjects);
    setProjectsToShow(projectsArr.current);
    if (projects.length === projectsArr.current.length) {
      setShowMore(false);
    }
  };

  useEffect(() => {
    loopProjects(0, projectsPerPage);

    // gsap.context + revert on cleanup keeps this StrictMode-safe (see
    // Navbar.js for why): without it, React's dev-mode double-invoke of
    // this effect leaves two duplicate ScrollTrigger instances registered
    // per element with no cleanup on unmount.
    const ctx = gsap.context(() => {
      revealOnScroll(h2.current, {
        from: { y: 50, scale: 0.85 },
        trigger: ".project-wrapper",
        ease: "back.out(1.6)",
      });
    });

    return () => {
      projectsArr.current = [];
      projectImagesArr.current = [];
      imageCopyRun.current = false;
      start.current = 0;
      finish.current = 0;
      revealedCount.current = 0;
      preloadLinks.current.forEach((link) => link.remove());
      preloadLinks.current = [];
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [h2]);

  // Pops each project card in as it appears - scroll-triggered for the
  // first page (still off-screen when it mounts), played immediately for
  // every later "Load more" batch (already in view when the click adds
  // them, so there's nothing to scroll-trigger).
  useEffect(() => {
    if (!proj.current) return;
    const cards = Array.from(
      proj.current.querySelectorAll(".projects__main--project")
    );
    const newCards = cards.slice(revealedCount.current);
    if (newCards.length === 0) return;

    const isFirstBatch = revealedCount.current === 0;
    revealedCount.current = cards.length;

    const ctx = gsap.context(() => {
      revealOnScroll(newCards, {
        from: { y: 60, scale: 0.92 },
        trigger: isFirstBatch ? ".project-wrapper" : false,
        start: "top 80%",
        stagger: 0.12,
        ease: "back.out(1.5)",
      });
    });

    return () => ctx.revert();
  }, [projectsToShow]);

  const handelClickShowMore = () => {
    loopProjects(ref.current, ref.current + projectsPerPage);
    ref.current += projectsPerPage;
    window.scrollBy({
      top: 350,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  return (
    <div className="project-wrapper" id="project-wrapper">
      <section className="projects" id="projects">
        <div className="projects__bloc">
          <h2 className="heading-secondary" ref={h2}>
            My recent&nbsp;
            <span className="heading-secondary--blue">&nbsp;Projects.&nbsp;</span>
          </h2>
          <div className="projects__main" ref={proj}>
            {projectsToShow}
            {showMore && (
              <button className="btn-show-more" onClick={handelClickShowMore}>
                Load more
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Projects;
