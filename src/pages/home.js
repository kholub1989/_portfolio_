import React, { useEffect, useRef } from "react";
import "../main.scss";
import Logo from "../components/Logo/Logo";
import ScrollDownIcon from "../components/ScrollDown/ScrollDown";
import { gsap, Power3 } from "gsap";

function Home({ _data }) {
  const h1 = useRef(null);
  const h3 = useRef(null);
  const logo = useRef(null);
  const scrollDowIcon = useRef(null);

  useEffect(() => {
    gsap.from(h1.current, {
      x: -500,
      opacity: 0,
      duration: 1,
      delay: 0.5,
      ease: Power3.inOut,
    });
    gsap.from(h3.current, {
      y: 100,
      opacity: 0,
      duration: 2,
      delay: 0.5,
      ease: Power3.easeInOut,
    });
    gsap.from(logo.current, {
      scale: 0.5,
      y: 200,
      opacity: 0,
      duration: 1.5,
      delay: 1.5,
      ease: Power3.easeOut,
    });
    gsap.from(scrollDowIcon.current, {
      scale: 0,
      y: 100,
      opacity: 0,
      duration: 1.5,
      delay: 1.5,
      ease: Power3.easeOut,
    });
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
              <span className="heading-primary--blue">build </span>
              <span className="heading-primary--white">beautiful </span>
              <br />
              things and
              <span className="heading-primary--blue">I love what I do.</span>
            </h1>
            <h3 className="heading-tertiary" ref={h3}>
              {_data.occupation}
            </h3>
          </div>
          <div className="home__logo" ref={logo}>
            <Logo />
          </div>
        </section>
      </div>
      <div ref={scrollDowIcon}>
        <ScrollDownIcon />
      </div>
    </>
  );
}

export default Home;
