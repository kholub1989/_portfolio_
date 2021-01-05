import React, { Component } from "react";
import * as emailjs from "emailjs-com";
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
    val === null && (valid = false);
  });

  return valid;
};

class Form extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      message: "",
      formErrors: {
        name: "",
        email: "",
        message: "",
      },
    };
  }

  handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    let formErrors = { ...this.state.formErrors };

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

    this.setState({ formErrors, [name]: value });
  };

  // reset the fields
  resetForm = () => {
    this.setState({
      name: "",
      email: "",
      message: "",
    });
  };

  // send form
  submitForm = (e) => {
    e.preventDefault();
    const { name, email, message } = this.state;

    if (formValid(this.state)) {
      if (
        this.state.name !== "" &&
        this.state.email !== "" &&
        this.state.message !== ""
      ) {
        const templateParams = {
          name,
          email,
          message,
        };

        emailjs
          .send(
            "service_nudvj2o",
            "template_71p4vqr",
            templateParams,
            "user_tQou1KFs62CHyTDBvDBiu"
          )
          .then(
            (result) => {
              console.log(result.text);
            },
            (error) => {
              console.log(error.text);
            }
          );
        this.resetForm();
      }
    } else {
      console.error("FORM INVALID - DISPLAY ERROR MESSAGE");
    }
  };

  render() {
    const { name, email, message, formErrors } = this.state;
    return (
      <form className="contact-me__form" onSubmit={this.submitForm} noValidate>
        <div className="contact-me__form-box">
          <label className="contact-me__form--label" htmlFor="name">
            Name
          </label>
          <input
            // className="contact-me__form--input"
            className={
              formErrors.name.length > 0
                ? " contact-me__form--input error"
                : "contact-me__form--input"
            }
            name="name"
            type="text"
            placeholder="Name"
            value={name}
            noValidate
            onChange={this.handleChange}
          />

          {formErrors.name.length > 0 && (
            <span className="errorMessage">{formErrors.name}</span>
          )}
        </div>
        <div className="contact-me__form-box">
          <label className="contact-me__form--label" htmlFor="email">
            Email
          </label>
          <input
            // className="contact-me__form--input"
            className={
              formErrors.email.length > 0
                ? "contact-me__form--input error"
                : "contact-me__form--input"
            }
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            noValidate
            onChange={this.handleChange}
          />

          {formErrors.email.length > 0 && (
            <span className="errorMessage">{formErrors.email}</span>
          )}
        </div>
        <div className="contact-me__form-box">
          <label className="contact-me__form--label" htmlFor="text">
            Type something…
          </label>
          <textarea
            // className="contact-me__form--input"
            className={
              formErrors.message.length > 0
                ? "contact-me__form--input error"
                : "contact-me__form--input"
            }
            name="message"
            type="text"
            placeholder="Type something…"
            value={message}
            noValidate
            onChange={this.handleChange}
          ></textarea>

          {formErrors.message.length > 0 && (
            <span className="errorMessage">{formErrors.message}</span>
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
            value="Send"
            disabled={!formValid(this.state)}
          />
        </div>
      </form>
    );
  }
}

export default Form;
