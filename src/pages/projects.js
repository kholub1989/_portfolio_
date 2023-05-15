import React, { useState, useEffect, useRef } from "react";
import "../main.scss";
import { animateScroll as scroll } from "react-scroll";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const projectsPerPage = 2;
let projectsArr = [];
let imageUrlArr = [];
let imageCopyRun = false;
let start, finish;

function Projects({ _data }) {
  const h2 = useRef(null);
  const proj = useRef(null);
  gsap.registerPlugin(ScrollTrigger);

  const preloadImage = (end) => {
    return (() => {
      if (!imageCopyRun) {
        imageCopyRun = true;
        start = 0;
        finish = end*=2;
        _data.projects.forEach((p) => {
          imageUrlArr.push(p.image);
        });
      }

      for (let i = start; i < imageUrlArr.length; i++) {
        if (i < finish) {
          let link = document.createElement("link");
          link.rel = "preload";
          link.href = imageUrlArr[i];
          link.as = "image";

          document.head.appendChild(link);
        }
      }

      start = finish;
      finish = finish + 2;  // by two
    })();
  };

  const projects = _data.projects.map((item, index) => {
    let loading = (index === 1) ? "lazy" : "";
    return (
      <div className="projects__main--project  bounceInLeft" key={item.title}>
        <div className="project-img">
          <a className="project-img--link" href={item.url ? item.url : item.urlGit} target="”_blank”" aria-label={item.description}>
            <picture>
              <source 
                srcSet={item.images.desctop.img} 
                media="(min-width: 75em)"
                type="image/webp"
              />
              <source 
                srcSet={item.images.tablet.img}
                media="(min-width: 56.25em)"
                type="image/webp"
              />
              <source 
                srcSet={item.images.phone.img} 
                media="(min-width: 37.5em)"
                type="image/webp" 
              />
              <img
                width="640"
                height="360"
                src={item.images.regular.img}
                alt={item.description}
                loading={loading}
              />
            </picture>
          </a>
        </div>
        <div className="project-desc">
          <h3 className="heading-desc-title" ref={h2}>
            {item.title}
          </h3>
          <h4 className="heading-sub-title">{item.using}</h4>
          <p className="paragraph">{item.description}</p>
          {item.urlGit !== "" ? (
            <a className="btn" target="_blanc" href={item.urlGit}>
              View source
            </a>
          ) : null}
          {item.url !== "" ? (
            <a className="btn" target="_blanc" href={item.url}>
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

  const loopProjects = (start, end) => {
    preloadImage(end);
    const sliceProjects = projects.slice(start, end);
    projectsArr = projectsArr.concat(sliceProjects);
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
    loopProjects(ref.current, ref.current + projectsPerPage);
    ref.current += projectsPerPage;
    scroll.scrollMore(350);
  };

  return (
    <div className="project-wrapper">
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
