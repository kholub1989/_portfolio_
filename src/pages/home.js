import React, { useEffect, useRef } from "react";
import "../main.scss";
import Logo from "../components/Logo/Logo";
import ScrollDownIcon from "../components/ScrollDown/ScrollDown";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { prefersReducedMotion } from "../utils/scrollReveal";

gsap.registerPlugin(SplitText);

function Home({ _data }) {
  const h1 = useRef(null);
  const h3 = useRef(null);
  const logo = useRef(null);
  const scrollDowIcon = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    // The logo is a low-poly bird made of ~18 triangular <path> facets -
    // instead of popping in as one flat block, each facet spins in from a
    // random angle on its own, so the bird visibly assembles itself.
    // SplitText breaks the headline into its rendered lines so they cascade
    // up one after another instead of the whole heading sliding in at once.
    const headline = new SplitText(h1.current, { type: "lines" });
    const logoPaths = logo.current.querySelectorAll("path");

    // gsap.context + revert on cleanup keeps this StrictMode-safe (see
    // Navbar.js for why: without it, React's dev-mode double-invoke of
    // this effect leaves these tweens stuck mid-animation).
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(logoPaths, {
        opacity: 0,
        scale: 0,
        rotation: () => gsap.utils.random(-45, 45),
        transformOrigin: "50% 50%",
        duration: 0.6,
        ease: "back.out(1.7)",
        stagger: { each: 0.025, from: "random" },
      })
        .from(
          // No opacity here on purpose: the last line is this page's LCP
          // element on mobile, and Chrome won't count an element as
          // "painted" while it's still mid-opacity-tween - that was adding
          // ~1.2s of pure render delay to LCP. A transform-only slide still
          // reads as an entrance without ever hiding the text.
          headline.lines,
          {
            y: 20,
            duration: 0.6,
            stagger: 0.12,
          },
          0.15
        )
        .from(h3.current, { opacity: 0, y: 30, duration: 0.7 }, "-=0.5")
        // Starts as h3 (heading-tertiary) is finishing its own fade rather
        // than waiting for it to fully complete first - h3 is already
        // most of the way in by then, so it still reads as "after", just
        // without the extra dead time of a fully serial wait.
        .from(
          scrollDowIcon.current,
          { opacity: 0, scale: 0, y: 30, duration: 0.4 },
          "-=0.3"
        );
    });

    return () => {
      ctx.revert();
      headline.revert();
    };
  }, [h1, h3, logo, scrollDowIcon]);

  return (
    <>
      <div className="home-wrapper">
        <section className="home">
          <div className="home__text">
            <h1 className="heading-primary" ref={h1}>
              <span className="heading-primary--white">Hi, </span> <br />
              I’m <span className="heading-primary--blue">{_data.name} </span>
              <br />I <span className="heading-primary--blue">design </span>and
              <span className="heading-primary--blue"> build </span>
              <span className="heading-primary--white">beautiful </span>
              <br />
              things and
              <span className="heading-primary--blue"> I love what I do.</span>
            </h1>
            <h2 className="heading-tertiary" ref={h3}>
              {_data.occupation}
            </h2>
          </div>
          <div className="home__logo" ref={logo}>
            <Logo />
          </div>
        </section>
        <div ref={scrollDowIcon}>
          <ScrollDownIcon />
        </div>
      </div>
    </>
  );
}

export default Home;