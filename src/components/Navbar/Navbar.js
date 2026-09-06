import React, { useEffect, useRef, useState } from "react";
import Logo from "../Logo/Logo";
import "../../main.scss";
import { gsap, Power3 } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ThemeBtn from "../LightDarkTheme/ThemeBtn";
import { prefersReducedMotion } from "../../utils/scrollReveal";

gsap.registerPlugin(ScrollTrigger);

const NAV_SECTIONS = [
  { label: "Home", id: "home-wrapper" },
  { label: "About", id: "about-wrapper" },
  { label: "Projects", id: "project-wrapper" },
  { label: "Contact me", id: "contact-me-wrapper" },
];
const NAV_IDS = NAV_SECTIONS.map((section) => section.id);

function scrollToId(id, offset = 0) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });
}

// Tracks which nav section is currently in view, via IntersectionObserver
// instead of react-scroll's scroll-position polling - watches a thin band
// near the vertical center of the viewport and treats whichever section
// crosses it as active, the same "spy" behavior the old <Link spy> gave.
function useActiveSection(ids) {
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (!visible.length) return;
        const topMost = visible.reduce((a, b) =>
          a.boundingClientRect.top <= b.boundingClientRect.top ? a : b
        );
        setActiveId(topMost.target.id);
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}

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
  const activeId = useActiveSection(NAV_IDS);

  const handleNavClick = (id) => (event) => {
    event.preventDefault();
    scrollToId(id);
    if (onNavigate) onNavigate();
  };

  return (
    <nav className="nav nav__main" id={onNavigate ? "mobile-nav-menu" : undefined}>
      <ul className="nav__list">
        {NAV_SECTIONS.map(({ label, id }) => (
          <li className="nav__item" key={id}>
            <a
              className={`nav__link${id === activeId ? " nav-active" : ""}`}
              href={`#${id}`}
              onClick={handleNavClick(id)}
            >
              {label}
            </a>
          </li>
        ))}
        {!isViewportMobile &&
        <li className="nav__item nav__item--theme">
          <ThemeBtn _data={_data} />
        </li>
        }
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
        <a
          className="header__wrapper--link"
          href="#home"
          aria-label="logo"
          onClick={(event) => {
            event.preventDefault();
            scrollToId("home", -50);
          }}
          onMouseEnter={handleLogoFlutter}
          onFocus={handleLogoFlutter}
        >
          <Logo ref={logo} />
        </a>
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
