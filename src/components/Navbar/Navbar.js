import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-scroll";
import Logo from "../Logo/Logo";
import "../../main.scss";
import { gsap, Power3 } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ThemeBtn from "../LightDarkTheme/ThemeBtn";
import { prefersReducedMotion } from "../../utils/scrollReveal";

gsap.registerPlugin(ScrollTrigger);

const MobileList = ({ _data, isViewportMobile, isPhone}) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const logoEl = document.querySelector(".header__wrapper--link");
    if (!logoEl) return;
    logoEl.classList.toggle("hide-element", active && isPhone);
    return () => logoEl.classList.remove("hide-element");
  }, [active, isPhone]);

  return (
    <>
      {active && (
        <List
          _data={_data}
          isViewportMobile={isViewportMobile}
          onNavigate={() => setActive(false)}
        />
      )}
      <nav className="nav">
        <ul className="nav__list">
          <li className="nav__item nav__item--theme">
            <ThemeBtn _data={_data} />
          </li>
          <li className="nav__item nav__item--theme">
            <div className="burger-menu-wrapper">
              <button
                type="button"
                className={!active ? "burger-menu" : "burger-menu menu-on"}
                onClick={() => {
                  setActive(!active);
                }}
                aria-expanded={active}
                aria-controls="mobile-nav-menu"
                aria-label={active ? "Close menu" : "Open menu"}
              >
                <div className="burger"></div>
              </button>
            </div>
          </li>
        </ul>
      </nav>
    </>
  );
};

const List = ({ _data, isViewportMobile, onNavigate }) => {
  return (
    <nav className="nav nav__main" id={onNavigate ? "mobile-nav-menu" : undefined}>
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
            href="home-wrapper"
            onClick={onNavigate}
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
            href="about-wrapper"
            onClick={onNavigate}
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
            href="project-wrapper"
            onClick={onNavigate}
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
            href="contact-me-wrapper"
            onClick={onNavigate}
          >
            Contact me
          </Link>
        </li>
        {!isViewportMobile &&
        <li className="nav__item nav__item--theme">
          <ThemeBtn _data={_data} />
        </li>
        }
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

const Navbar = ({ _data }) => {
  const header = useRef(null);
  const customScroll = useRef(null);
  const logo = useRef(null);

  // Small pop on hover/focus - a single smooth scale up and back down,
  // no wiggle/oscillation. One-shot: it settles back to rest on its own,
  // so there's no separate mouseleave/blur handler to reset it.
  const handleLogoFlutter = () => {
    if (prefersReducedMotion() || !logo.current) return;
    gsap.killTweensOf(logo.current);
    gsap.to(logo.current, {
      scale: 1.12,
      duration: 0.25,
      ease: "power2.out",
      transformOrigin: "50% 50%",
      yoyo: true,
      repeat: 1,
    });
  };

  const [isMobile, setIsMobile] = useState(
    window.matchMedia("(max-width:900px)").matches
  );

  const [isPhone, setIsPhone] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.matchMedia("(max-width:900px)").matches);
      setIsPhone(window.matchMedia("(max-width:400px)").matches);
    };
    window.addEventListener("resize", handleResize);

    // gsap.context + revert on cleanup keeps this StrictMode-safe: without
    // it, React's dev-mode double-invoke of this effect creates a second
    // tween mid-flight of the first, which corrupts the captured end state
    // and leaves the header stuck at low opacity.
    const ctx = gsap.context(() => {
      gsap.from(header.current, {
        opacity: 0,
        y: -50,
        duration: 1.2,
        ease: Power3.easeOut,
      });
      gsap.to(customScroll.current, {
        value: 100,
        // ease: "none",
        scrollTrigger: {
          scrub: 0.3,
        },
      });
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      ctx.revert();
    };
  }, [header, customScroll]);

  return (
    <header className="header" ref={header}>
      <div className="header__wrapper">
        <Link
          to="home"
          smooth={true}
          offset={-50}
          duration={400}
          className="header__wrapper--link"
          href="/"
          aria-label="logo"
          onMouseEnter={handleLogoFlutter}
          onFocus={handleLogoFlutter}
        >
          <Logo ref={logo} />
        </Link>
        {isMobile ? (
          <MobileList
            _data={_data}
            isViewportMobile={isMobile}
            isPhone={isPhone}
          />
        ) : (
          <List _data={_data} isViewportMobile={isMobile} />
        )}
      </div>
      <progress max="100" value="0" ref={customScroll}></progress>
    </header>
  );
};

export default Navbar;
