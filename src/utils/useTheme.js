import { useDarkMode } from "./useDarkMode";

const lightTheme = "light-mode";
const darkTheme = "dark-mode";

export const useTheme = () => {
  const darkMode = useDarkMode();

  return darkMode.value ? darkTheme : lightTheme;
};