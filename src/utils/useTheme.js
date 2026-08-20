import useDarkMode from "use-dark-mode";

const lightTheme = "light-mode";
const darkTheme = "dark-mode";

export const useTheme = () => {
  const darkMode = useDarkMode(false);

  return darkMode.value ? darkTheme : lightTheme;
};