import React, { useEffect, useRef } from "react";
import "../main.scss";
import Logo from "../components/Logo/Logo";
import ScrollDownIcon from "../components/ScrollDown/ScrollDown";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { prefersReducedMotion } from "../utils/scrollReveal";

gsap.registerPlugin(SplitText);

function Home({ _data }) {
  const textWrapper = useRef(null);
  const h1 = useRef(null);
  const h3 = useRef(null);
  const logo = useRef(null);
  const scrollDowIcon = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      // .home__text, .home__logo, and .home-wrapper__scroll-down all
      // default to opacity: 0 in CSS (see _home.scss) so the entrance
      // below has something to animate from without a flash of visible
      // content first. Skipping the animation entirely would strand them
      // hidden, so set them back to visible here instead.
      gsap.set([textWrapper.current, logo.current, scrollDowIcon.current], {
        opacity: 1,
      });
      return;
    }

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

      // .home__logo has no opacity tween of its own (only its individual
      // <path> children do, below) but defaults to opacity: 0 in CSS, so
      // it needs an explicit reveal or it stays invisible forever. A
      // plain set (not a read-current-value tween) is safe here.
      tl.set(logo.current, { opacity: 1 }, 0)
        // fromTo (not from) throughout below - deliberately explicit about
        // both endpoints instead of letting GSAP read the *current*
        // computed style as the implicit end value. These elements default
        // to opacity: 0 in CSS (see the flash-prevention note in
        // _home.scss), so a plain .from({opacity: 0}) would read that same
        // 0 as its own "current" end value and animate 0 -> 0: a no-op
        // that looks identical to a permanently stuck animation.
        .fromTo(
          textWrapper.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.8 },
          0
        )
        .fromTo(
          logoPaths,
          {
            opacity: 0,
            scale: 0,
            rotation: () => gsap.utils.random(-45, 45),
            transformOrigin: "50% 50%",
          },
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.6,
            ease: "back.out(1.7)",
            stagger: { each: 0.025, from: "random" },
          },
          0
        )
        .from(
          // No opacity here on purpose: the last line is this page's LCP
          // element on mobile, and Chrome won't count an element as
          // "painted" while it's still mid-opacity-tween - that was adding
          // ~1.2s of pure render delay to LCP. A transform-only slide still
          // reads as an entrance without ever hiding the text. Safe as a
          // plain .from() since these lines have no CSS opacity default.
          headline.lines,
          {
            y: 20,
            duration: 0.6,
            stagger: 0.12,
          },
          0.15
        )
        // h3 (heading-tertiary) has no CSS opacity default of its own, so
        // a plain .from() is safe here - its "current" computed opacity is
        // genuinely 1, unaffected by the wrapper's own default.
        .from(h3.current, { opacity: 0, y: 30, duration: 0.7 }, "-=0.5")
        // Starts as h3 is finishing its own fade rather than waiting for
        // it to fully complete first - h3 is already most of the way in
        // by then, so it still reads as "after", just without the extra
        // dead time of a fully serial wait.
        .fromTo(
          scrollDowIcon.current,
          { opacity: 0, scale: 0, y: 30 },
          { opacity: 1, scale: 1, y: 0, duration: 0.4 },
          "-=0.3"
        );
    });

    return () => {
      ctx.revert();
      headline.revert();
    };
  }, [textWrapper, h1, h3, logo, scrollDowIcon]);

  return (
    <>
      <div className="home-wrapper" id="home-wrapper">
        <section className="home" id="home">
          <div className="home__text" ref={textWrapper}>
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
        <div className="home-wrapper__scroll-down" ref={scrollDowIcon}>
          <ScrollDownIcon />
        </div>
      </div>
    </>
  );
}

export default Home;