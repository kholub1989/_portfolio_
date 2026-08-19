import React, { useEffect, useRef } from "react";
import "../main.scss";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function About({ _data }) {
  gsap.registerPlugin(ScrollTrigger);
  const h2 = useRef(null);
  const p1 = useRef(null);
  const p2a = useRef(null);
  const p2b = useRef(null);
  const p2c = useRef(null);
  const p2d = useRef(null);
  const p3 = useRef(null);
  const image = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      h2.current,
      {
        opacity: 0,
        scale: 0.2,
        y: 100,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        scrollTrigger: {
          trigger: ".about-wrapper",
          start: "top bottom",
          end: "center bottom",
          scrub: true,
          once: true,
        },
      }
    );
    gsap.fromTo(
      p1.current,
      {
        opacity: 0,
        x: -300,
      },
      {
        opacity: 1,
        x: 0,
        scrollTrigger: {
          trigger: ".about-wrapper",
          start: "top bottom",
          end: "center center",
          scrub: true,
          once: true,
        },
      }
    );
    gsap.fromTo(
      [p2a.current, p2b.current, p2c.current, p2d.current],
      {
        opacity: 0,
        x: -600,
      },
      {
        opacity: 1,
        x: 0,
        scrollTrigger: {
          trigger: ".about-wrapper",
          start: "top bottom +200",
          end: "center center",
          scrub: true,
          once: true,
        },
      }
    );
    gsap.fromTo(
      p3.current,
      {
        opacity: 0,
        x: -1200,
      },
      {
        opacity: 1,
        x: 0,
        scrollTrigger: {
          trigger: ".about-wrapper",
          start: "top bottom",
          end: "center center",
          scrub: true,
          once: true,
        },
      }
    );
    gsap.fromTo(
      image.current,
      {
        scale: 0.5,
        y: 100,
        opacity: 0.5,
      },
      {
        scale: 1,
        y: 0,
        opacity: 1,
        scrollTrigger: {
          trigger: ".about-wrapper",
          start: "top center",
          end: "center center",
          scrub: true,
          once: true,
        },
      }
    );
  }, [h2, p1, p2a, p2b, p2c, p2d, p3, image]);

  return (
    <div className="about-wrapper">
      <section className="about">
        <h2 className="heading-secondary" ref={h2}>
          I build modern experiences for humans with&nbsp;
          <span className="heading-secondary--blue">&nbsp;Love.&nbsp;</span>
        </h2>
        <div className="about__main">
          <div className="about__text-box">
            <p className="paragraph" ref={p1}>
              {_data.bio}
            </p>
            <h3 className="heading-title">Programming Languages, Frameworks & Database:</h3>
            <p className="paragraph" ref={p2a}>
              {_data.skillsPLFD}
            </p>
            <h3 className="heading-title">Web Technologies:</h3>
            <p className="paragraph" ref={p2b}>
              {_data.skillsWT}
            </p>
            <h3 className="heading-title">Programming Paradigms & Principles:</h3>
            <p className="paragraph" ref={p2c}>
              {_data.skillsDP}
            </p>
            <h3 className="heading-title">Tools & Platforms:</h3>
            <p className="paragraph" ref={p2d}>
              {_data.skillsTP}
            </p>
            <h3 className="heading-title">Design Tools:</h3>
            <p className="paragraph" ref={p3}>
              {_data.designTools}
            </p>
            <p className="paragraph">
              Would you like to learn about my journey as a developer? <br />
              Check me out on{" "}
              <a
                className="btn-link"
                href="https://www.linkedin.com/in/kholub1989/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn &rarr;
              </a>
              <br />
              Because resumes are old fashioned now.
            </p>
          </div>
          <picture>
            <source 
              srcSet={_data.avatar.desctop.img}
              media="(min-width: 75em)"
              type="image/webp"
            />
            <source
              srcSet={_data.avatar.tablet.img}
              media="(min-width: 56.25em)"
              type="image/webp"
            />
            <source
              srcSet={_data.avatar.phone.img}
              media="(min-width: 37.5em)"
              type="image/webp"
            />
            <img
              src={_data.avatar.regular.img}
              alt="avatar"
              width="420"
              height="540"
              className="about__img"
              ref={image}
            />
          </picture>
        </div>
      </section>
    </div>
  );
}

export default About;
