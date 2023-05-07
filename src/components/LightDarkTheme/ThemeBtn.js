import React from "react";
import useDarkMode from "use-dark-mode";
import "../../main.scss";
import { useTheme } from "../../utils/useTheme";

const ThemeBtn = ({ _data }) => {
  const darkMode = useDarkMode(true);
  const theme = useTheme();
  let sun = _data.main.toggleIcons[0].icon;
  let moon = _data.main.toggleIcons[1].icon;
  let sunAriaLabel = _data.main.toggleIcons[0].ariaLabel;
  let moonAriaLabel = _data.main.toggleIcons[1].ariaLabel;

  return (
    <button 
      className="btn-theme" 
      type="button"
      aria-label={theme === "dark-mode" ? sunAriaLabel : moonAriaLabel} 
      onClick={darkMode.toggle}>
      <svg className="btn-theme__icon">
        <use xlinkHref={theme === "dark-mode" ? sun : moon}></use>
      </svg>
    </button>
  );
};

export default ThemeBtn;
