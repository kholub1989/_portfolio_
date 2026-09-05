import React, { useEffect, useRef } from "react";
import "../main.scss";
import { gsap } from "gsap";
import { revealOnScroll } from "../utils/scrollReveal";

// Matches .about__img's max-width (see _about.scss): full viewport on
// phone, capped at 35rem (up to 420px at the widest root font-size) above.
const AVATAR_IMAGE_SIZES = "(max-width: 37.5em) 100vw, 420px";

function About({ _data }) {
  const h2 = useRef(null);
  const p1 = useRef(null);
  const p2a = useRef(null);
  const p2b = useRef(null);
  const p2c = useRef(null);
  const p2d = useRef(null);
  const p3 = useRef(null);
  const image = useRef(null);

  useEffect(() => {
    // gsap.context + revert on cleanup keeps this StrictMode-safe (see
    // Navbar.js for why): without it, React's dev-mode double-invoke of
    // this effect leaves two duplicate ScrollTrigger instances registered
    // per element with no cleanup on unmount.
    const ctx = gsap.context(() => {
      revealOnScroll(h2.current, {
        from: { y: 50, scale: 0.85 },
        trigger: ".about-wrapper",
        ease: "back.out(1.6)",
      });
      revealOnScroll(p1.current, {
        from: { y: 40 },
        trigger: ".about-wrapper",
      });
      revealOnScroll([p2a.current, p2b.current, p2c.current, p2d.current], {
        from: { y: 40 },
        trigger: ".about-wrapper",
        start: "top 65%",
        stagger: 0.15,
      });
      revealOnScroll(p3.current, {
        from: { y: 40 },
        trigger: ".about-wrapper",
        start: "top 55%",
      });
      revealOnScroll(image.current, {
        from: { y: 60, scale: 0.9 },
        trigger: ".about-wrapper",
        start: "top 55%",
      });
    });

    return () => ctx.revert();
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
          <img
            src={_data.avatar.phone.img}
            srcSet={`${_data.avatar.phone.img} 480w, ${_data.avatar.tablet.img} 800w, ${_data.avatar.desctop.img} 1200w`}
            sizes={AVATAR_IMAGE_SIZES}
            alt="avatar"
            width="420"
            height="540"
            className="about__img"
            ref={image}
          />
        </div>
      </section>
    </div>
  );
}

export default About;
