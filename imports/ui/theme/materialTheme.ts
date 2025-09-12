import { createTheme, ThemeOptions } from "@mui/material/styles";

// Generated from material-theme.json (Material Theme Builder export)
// This file exports two themes (light/dark) and a helper to pick one by prefers-color-scheme

const lightPalette: ThemeOptions["palette"] = {
  mode: "light",
  primary: {
    main: "#415F91",
    contrastText: "#FFFFFF",
  },
  secondary: {
    main: "#565F71",
    contrastText: "#FFFFFF",
  },
  error: {
    main: "#BA1A1A",
    contrastText: "#FFFFFF",
  },
  background: {
    default: "#F9F9FF",
    paper: "#F9F9FF",
  },
  text: {
    primary: "#191C20",
    secondary: "#44474E",
  },
  divider: "#C4C6D0",
};

const darkPalette: ThemeOptions["palette"] = {
  mode: "dark",
  primary: {
    main: "#AAC7FF",
    contrastText: "#0A305F",
  },
  secondary: {
    main: "#BEC6DC",
    contrastText: "#283141",
  },
  error: {
    main: "#FFB4AB",
    contrastText: "#690005",
  },
  background: {
    default: "#111318",
    paper: "#111318",
  },
  text: {
    primary: "#E2E2E9",
    secondary: "#C4C6D0",
  },
  divider: "#44474E",
};

export const lightTheme = createTheme({
  palette: lightPalette,
  components: {
    MuiAppBar: {
      defaultProps: { elevation: 0 },
    },
  },
});

export const darkTheme = createTheme({
  palette: darkPalette,
  components: {
    MuiAppBar: {
      defaultProps: { elevation: 0 },
    },
  },
});

export function getThemeForSystem(prefersDark: boolean) {
  return prefersDark ? darkTheme : lightTheme;
}

export default lightTheme;
