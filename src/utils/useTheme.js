import React, { useEffect } from "react";

import useDarkMode from "use-dark-mode";

const lightTheme = "light-mode";
const darkTheme = "dark-mode";

export const useTheme = () => {
  const darkMode = useDarkMode(false);

  const [theme, setTheme] = React.useState(darkTheme);

  useEffect(() => {
    setTheme(darkMode?.value ? darkTheme : lightTheme);
  }, [darkMode.value]);

  return theme;
};