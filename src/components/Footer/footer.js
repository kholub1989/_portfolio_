import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { revealOnScroll } from "../../utils/scrollReveal";
import "../../main.scss";

function Footer({ _data }) {
  const footer = useRef(null);

  useEffect(() => {
    // gsap.context + revert on cleanup keeps this StrictMode-safe (see
    // Navbar.js for why): without it, React's dev-mode double-invoke of
    // this effect leaves two duplicate ScrollTrigger instances registered
    // per element with no cleanup on unmount.
    const ctx = gsap.context(() => {
      // "top bottom" (not the default "top 85%"): the footer is the last
      // element on the page, so there's no content below it to scroll
      // through. On a tall/short-page viewport, "85%" can demand more
      // scroll distance than the page physically has - the browser hits
      // max scroll just short of the trigger point, and it never fires.
      // "top bottom" fires as soon as the footer starts entering view,
      // which is always reachable no matter the viewport-to-page ratio.
      revealOnScroll(footer.current, {
        from: { y: 60, scale: 0.92 },
        trigger: ".footer",
        start: "top bottom",
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <footer className="footer">
      <div className="footer__wrapper" ref={footer}>
        <p className="footer__paragraph paragraph">
          Handcrafted By Me In {new Date().getFullYear()} &copy;
        </p>
        <div className="footer__social">
          <p className="footer__social--text paragraph">Let’s Be Friends</p>
          <ul className="footer__list hover-target">
            {_data.main.socialLinks.map((item) => {
              return (
                <li className="footer__item" key={item.name}>
                  <a
                    className="footer__link"
                    target="_blank"
                    rel="noreferrer"
                    href={item.url}
                    aria-label={item.name}
                  >
                    <svg className="footer__icon">
                      <use xlinkHref={item.icon}></use>
                    </svg>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
