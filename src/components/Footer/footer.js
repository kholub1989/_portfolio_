import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../../main.scss";

function Footer({ _data }) {
  const footer = useRef(null);
  gsap.registerPlugin(ScrollTrigger);

  useEffect(() => {
    gsap.fromTo(
      footer.current,
      {
        opacity: 0,
        scale: 0.2,
        y: 200,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        scrollTrigger: {
          trigger: ".footer",
          start: "top bottom",
          end: "bottom bottom",
          scrub: true,
          once: true,
        },
      }
    );
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
