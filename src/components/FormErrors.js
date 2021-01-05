import React from "react";

export const FormErrors = ({ formErrors }) => (
  <div className="error__wrapper">
    {Object.keys(formErrors).map((fieldName) => {
      if (formErrors[fieldName].length > 0) {
        return (
          <p key={fieldName} className="error__text bounceInLeft">
            {fieldName} {formErrors[fieldName]}
          </p>
        );
      } else {
        return "";
      }
    })}
  </div>
);
