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
    // visibility:hidden, not the SR-visible .hide-element utility: this
    // needs to disappear for everyone (screen readers and keyboard tab
    // order included) while the menu covers it, not just visually while
    // staying announced/focusable.
    logoEl.classList.toggle("logo-hidden", active && isPhone);
    return () => logoEl.classList.remove("logo-hidden");
  }, [active, isPhone]);

  return (
    <>
      <List
        _data={_data}
        isViewportMobile={isViewportMobile}
        onNavigate={() => setActive(false)}
        collapsed={!active}
      />
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

const List = ({ _data, isViewportMobile, onNavigate, collapsed = false }) => {
  const activeId = useActiveSection(NAV_IDS);

  const handleNavClick = (id) => (event) => {
    event.preventDefault();
    scrollToId(id);
    if (onNavigate) onNavigate();
  };

  return (
    <nav
      className={`nav nav__main${collapsed ? " nav__main--collapsed" : ""}`}
      id={onNavigate ? "mobile-nav-menu" : undefined}
    >
      <ul className="nav__list">
        {NAV_SECTIONS.map(({ label, id }) => (
          <li className="nav__item" key={id}>
            <a
              className={`nav__link${id === activeId ? " nav-active" : ""}`}
              aria-current={id === activeId ? "true" : undefined}
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

  const [isPhone, setIsPhone] = useState(
    window.matchMedia("(max-width:400px)").matches
  );

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
      // .header defaults to opacity: 0 in CSS (see _navbar.scss) so this
      // entrance has something to animate from without a flash of the
      // fully-visible header first. Reduced-motion visitors skip the
      // tween, so set it back to visible directly instead of leaving it
      // stranded hidden.
      if (prefersReducedMotion()) {
        gsap.set(header.current, { opacity: 1, y: 0 });
      } else {
        // fromTo (not from) deliberately: .header's CSS default is also
        // opacity: 0, and .from() reads the element's *current* computed
        // style as its implicit end value - that would read the same 0 and
        // animate 0 -> 0, a no-op that looks identical to a permanently
        // stuck header (see the matching note in home.js for the full
        // explanation of this GSAP gotcha).
        gsap.fromTo(
          header.current,
          { opacity: 0, y: -50 },
          { opacity: 1, y: 0, duration: 1.2, ease: Power3.easeOut }
        );
      }
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
