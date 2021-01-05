import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-scroll";
import Logo from "../Logo/Logo";
import "../../main.scss";
import { gsap, Power3 } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const MobileList = () => {
  const [active, setActive] = useState(false);
  return (
    <>
      {active && <List />}
      <div
        className={!active ? "burger-menu" : "burger-menu menu-on"}
        onClick={() => {
          setActive(!active);
        }}
      >
        <div className="burger"></div>
      </div>
    </>
  );
};

const List = () => {
  return (
    <nav className="nav">
      <ul className="nav__list">
        <li className="nav__item">
          <Link
            className="nav__link"
            activeClass="nav-active"
            to="home-wrapper"
            spy={true}
            smooth={true}
            // offset={-50}
            duration={600}
          >
            Home
          </Link>
        </li>
        <li className="nav__item">
          <Link
            className="nav__link"
            activeClass="nav-active"
            to="about-wrapper"
            spy={true}
            smooth={true}
            // offset={-80}
            duration={600}
          >
            About
          </Link>
        </li>
        <li className="nav__item">
          <Link
            className="nav__link"
            activeClass="nav-active"
            to="project-wrapper"
            spy={true}
            smooth={true}
            // offset={-70}
            // offset={-80}
            duration={600}
          >
            Projects
          </Link>
        </li>
        <li className="nav__item">
          <Link
            className="nav__link"
            activeClass="nav-active"
            to="contact-me-wrapper"
            spy={true}
            smooth={true}
            // offset={-50}
            duration={600}
          >
            Contact me
          </Link>
        </li>
        {/* <li className="nav__item hover-target">
          <a href="#home" className="smoothscroll nav__link nav-active">
            Home
          </a>
        </li>
        <li className="nav__item hover-target">
          <a href="#about" className=" smoothscroll nav__link">
            About
          </a>
        </li>
        <li className="nav__item hover-target">
          <a href="#work" className="smoothscroll nav__link">
            Work
          </a>
        </li>
        <li className="nav__item hover-target">
          <a href="#contact-me" className="smoothscroll nav__link">
            Contact Me
          </a>
        </li> */}
      </ul>
    </nav>
  );
};

const Navbar = () => {
  gsap.registerPlugin(ScrollTrigger);
  const header = useRef(null);
  const customScroll = useRef(null);
  const [isMobile, setIsMobile] = useState(
    window.matchMedia("(max-width:900px)").matches
  );

  useEffect(() => {
    window.addEventListener("resize", () => {
      setIsMobile(window.matchMedia("(max-width:900px)").matches);
    });
    gsap.from(header.current, {
      opacity: 0,
      y: -50,
      duration: 1.5,
      ease: Power3.easeOut,
    });
    gsap.to(customScroll.current, {
      value: 100,
      ease: "none",
      scrollTrigger: { scrub: 0.3, once: true },
    });
  }, [header, customScroll]);

  return (
    <div className="header" ref={header}>
      <div className="header__wrapper">
        <Link
          to="home"
          smooth={true}
          offset={-50}
          duration={400}
          className="header__wrapper--link"
        >
          <Logo />
        </Link>
        {isMobile ? <MobileList /> : <List />}
      </div>
      <progress max="100" value="0" ref={customScroll}></progress>
    </div>
  );
};

export default Navbar;
