import React, { useRef, useEffect } from "react";
import Form from "../components/Form/Form";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../main.scss";

function ContactMe() {
  gsap.registerPlugin(ScrollTrigger);
  const h2 = useRef(null);
  const form = useRef(null);

  useEffect(() => {
    // gsap.context + revert on cleanup keeps this StrictMode-safe (see
    // Navbar.js for why): without it, React's dev-mode double-invoke of
    // this effect leaves two duplicate ScrollTrigger instances registered
    // per element with no cleanup on unmount.
    const ctx = gsap.context(() => {
      gsap.fromTo(
        h2.current,
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
            trigger: ".contact-me-wrapper",
            start: "top bottom",
            end: "center bottom",
            scrub: true,
            once: true,
          },
        }
      );
      gsap.fromTo(
        form.current,
        {
          opacity: 0,
          scale: 0,
          y: 200,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          scrollTrigger: {
            trigger: ".contact-me__bloc",
            start: "top bottom",
            end: "center bottom",
            scrub: true,
            once: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, [h2, form]);

  return (
    <div className="contact-me-wrapper">
      <section className="contact-me" id="contact-me">
        <div className="contact-me__bloc">
          <h2 className="heading-secondary" ref={h2}>
            If you have a project that you want to get started, think you need help or just want to saying&nbsp;
            <span className="heading-secondary--blue">&nbsp;Hey.&nbsp;</span>
          </h2>
          <div className="from-container" ref={form}>
            <Form />
          </div>
        </div>
      </section>
    </div>
  );
}
export default ContactMe;
