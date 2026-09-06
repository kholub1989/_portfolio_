import React, { useRef, useEffect } from "react";
import Form from "../components/Form/Form";
import { gsap } from "gsap";
import { revealOnScroll } from "../utils/scrollReveal";
import "../main.scss";

function ContactMe() {
  const h2 = useRef(null);
  const form = useRef(null);

  useEffect(() => {
    // gsap.context + revert on cleanup keeps this StrictMode-safe (see
    // Navbar.js for why): without it, React's dev-mode double-invoke of
    // this effect leaves two duplicate ScrollTrigger instances registered
    // per element with no cleanup on unmount.
    const ctx = gsap.context(() => {
      revealOnScroll(h2.current, {
        from: { y: 50, scale: 0.85 },
        trigger: ".contact-me-wrapper",
        ease: "back.out(1.6)",
      });
      revealOnScroll(form.current, {
        from: { y: 60, scale: 0.92 },
        trigger: ".contact-me__bloc",
      });
    });

    return () => ctx.revert();
  }, [h2, form]);

  return (
    <div className="contact-me-wrapper" id="contact-me-wrapper">
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
