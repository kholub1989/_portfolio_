import React, { useState, useEffect, useRef } from "react";
import "../main.scss";
import { animateScroll as scroll } from "react-scroll";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const projectsPerPage = 2;
let projectsArr = [];

function Projects({ _data }) {
  const h2 = useRef(null);
  const proj = useRef(null);
  gsap.registerPlugin(ScrollTrigger);

  const projects = _data.projects.map((p) => {
    return (
      <div className="projects__main--project  bounceInLeft" key={p.title}>
        <div className="project-img">
          <a href={p.url} target="”_blank”">
            <img width="640" height="360" src={p.image} alt={p.title} />
          </a>
        </div>
        <div className="project-desc">
          <h3 className="heading-desc-title" ref={h2}>
            {p.title}
          </h3>
          <h4 className="heading-sub-title">{p.using}</h4>
          <p className="paragraph">{p.description}</p>
          <a className="btn" target="_blanc" href={p.urlGit}>
            View source
          </a>
          <a className="btn" target="_blanc" href={p.url}>
            Try it Live
          </a>
        </div>
      </div>
    );
  });

  const [projectsToShow, setProjectsToShow] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [next, setNext] = useState(2);

  const loopProjects = (start, end) => {
    const sliceProjects = projects.slice(start, end);
    projectsArr = [...projectsArr, ...sliceProjects];
    setProjectsToShow(projectsArr);
    if (projects.length === projectsArr.length) {
      setShowMore(false);
    }
  };

  useEffect(() => {
    loopProjects(0, projectsPerPage);
    gsap.fromTo(
      h2.current,
      {
        opacity: 0,
        scale: 0.2,
        y: 200,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        scrollTrigger: {
          once: true,
          trigger: ".project-wrapper",
          start: "top bottom",
          end: "center bottom",
          scrub: true,
        },
      }
    );
    gsap.fromTo(
      proj.current,
      {
        opacity: 0,
        scale: 0,
        y: 200,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        scrollTrigger: {
          once: true,
          trigger: ".project-wrapper",
          start: "top bottom",
          end: "center bottom",
          scrub: true,
        },
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [h2, proj]);

  const handelClickShowMore = () => {
    loopProjects(next, next + projectsPerPage);
    setNext(next + projectsPerPage);
    scroll.scrollMore(350);
  };

  return (
    <div className="project-wrapper">
      <section className="projects" id="projects">
        <div className="projects__bloc">
          <h2 className="heading-secondary" ref={h2}>
            My recent <span className="heading-secondary--blue">Projects.</span>
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
