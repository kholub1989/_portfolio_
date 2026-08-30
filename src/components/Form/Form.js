import emailjs from "@emailjs/browser";
import React, { useState } from "react";
import "../../main.scss";

const emailRegex = RegExp(
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
);

const formValid = ({ formErrors, ...rest }) => {
  let valid = true;

  // validate form errors being empty
  Object.values(formErrors).forEach((val) => {
    val.length > 0 && (valid = false);
  });

  // validate the form was filled out
  Object.values(rest).forEach((val) => {
    val === "" && (valid = false);
  });

  return valid;
};

const Form = () => {
  const [state, setState] = useState({
    name: "",
    email: "",
    message: "",
    formErrors: {
      name: "",
      email: "",
      message: "",
    },
    submitStatus: null,
  });

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    let formErrors = { ...state.formErrors };

    switch (name) {
      case "name":
        formErrors.name =
          value.length < 3
            ? "Please provide a valid name, minimum 3 characters required"
            : "";
        break;
      case "email":
        formErrors.email = emailRegex.test(value)
          ? ""
          : "Please provide a valid e-mail";
        break;
      case "message":
        formErrors.message =
          value.length < 10 ? "Minimum 10 characters required" : "";
        break;
      default:
        break;
    }

    setState((prev) => ({
      ...prev,
      formErrors,
      [name]: value,
      submitStatus: null,
    }));
  };

  // reset the fields
  const resetForm = () => {
    setState((prev) => ({
      ...prev,
      name: "",
      email: "",
      message: "",
    }));
  };

  // send form
  const submitForm = (e) => {
    e.preventDefault();
    const { name, email, message } = state;

    if (formValid(state)) {
      if (name !== "" && email !== "" && message !== "") {
        const templateParams = {
          name,
          email,
          message,
        };

        setState((prev) => ({ ...prev, submitStatus: "sending" }));

        emailjs
          .send(
            "service_nudvj2o",
            "template_71p4vqr",
            templateParams,
            "Hvv7sWcNVzrp-olXj"
          )
          .then(
            () => {
              resetForm();
              setState((prev) => ({ ...prev, submitStatus: "success" }));
            },
            () => {
              setState((prev) => ({ ...prev, submitStatus: "error" }));
            }
          );
      }
    }
  };

  const { name, email, message, formErrors, submitStatus } = state;

  return (
    <form className="contact-me__form" onSubmit={submitForm} noValidate>
      <div className="contact-me__form-box">
        <label className="contact-me__form--label" htmlFor="name">
          Name
          <input
            id="name"
            className={
              formErrors.name.length > 0
                ? " contact-me__form--input error"
                : "contact-me__form--input"
            }
            name="name"
            type="text"
            placeholder="Name"
            value={name}
            aria-invalid={formErrors.name.length > 0}
            aria-describedby={formErrors.name.length > 0 ? "name-error" : undefined}
            onChange={handleChange}
          />
        </label>

        {formErrors.name.length > 0 && (
          <span className="errorMessage" id="name-error">{formErrors.name}</span>
        )}
      </div>
      <div className="contact-me__form-box">
        <label className="contact-me__form--label" htmlFor="email">
          Email
          <input
            id="email"
            className={
              formErrors.email.length > 0
                ? "contact-me__form--input error"
                : "contact-me__form--input"
            }
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            aria-invalid={formErrors.email.length > 0}
            aria-describedby={formErrors.email.length > 0 ? "email-error" : undefined}
            onChange={handleChange}
          />
        </label>
        {formErrors.email.length > 0 && (
          <span className="errorMessage" id="email-error">{formErrors.email}</span>
        )}
      </div>
      <div className="contact-me__form-box">
        <label className="contact-me__form--label" htmlFor="message">
          Type something…
          <textarea
            id="message"
            className={
              formErrors.message.length > 0
                ? "contact-me__form--input error"
                : "contact-me__form--input"
            }
            name="message"
            placeholder="Type something…"
            value={message}
            aria-invalid={formErrors.message.length > 0}
            aria-describedby={formErrors.message.length > 0 ? "message-error" : undefined}
            onChange={handleChange}
          />
        </label>

        {formErrors.message.length > 0 && (
          <span className="errorMessage" id="message-error">{formErrors.message}</span>
        )}
      </div>
      <div className="contact-me__form--btn">
        <p className="paragraph">
          Don’t like forms? That’s ok, just{" "}
          <a className="btn-link" href="mailto:kholub1989@gmail.com">
            email me
          </a>
        </p>
        <input
          className="btn-form"
          type="submit"
          value={submitStatus === "sending" ? "Sending…" : "Send"}
          disabled={!formValid(state) || submitStatus === "sending"}
        />
      </div>
      {submitStatus === "success" && (
        <p className="successMessage" role="status">
          Thanks! I’ll get back to you soon.
        </p>
      )}
      {submitStatus === "error" && (
        <p className="errorMessage" role="status">
          Something went wrong sending your message. Please try again or{" "}
          <a className="btn-link" href="mailto:kholub1989@gmail.com">
            email me directly
          </a>
          .
        </p>
      )}
    </form>
  );
};

export default Form;
