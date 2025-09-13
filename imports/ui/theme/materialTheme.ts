import { createTheme, ThemeOptions } from "@mui/material/styles";

// Generated from material-theme.json (Material Theme Builder export)
// This file exports two themes (light/dark) and a helper to pick one by prefers-color-scheme

const lightPalette: ThemeOptions["palette"] = {
  mode: "light",
  primary: {
    // Slightly brighter primary for better contrast on controls
    main: "#3D66A6",
    contrastText: "#FFFFFF",
  },
  secondary: {
    // Cooler neutral secondary for accents and chips
    main: "#6B7090",
    contrastText: "#FFFFFF",
  },
  error: {
    main: "#C23B3B",
    contrastText: "#FFFFFF",
  },
  background: {
    // Use an off-white to reduce glare while keeping a soft canvas
    default: "#FBFBFF",
    paper: "#FFFFFF",
  },
  text: {
    primary: "#0F1720",
    secondary: "#4B4F58",
  },
  divider: "#D7D9E4",
  action: {
    hover: "rgba(61,102,166,0.08)",
    selected: "rgba(61,102,166,0.12)",
  },
};

const darkPalette: ThemeOptions["palette"] = {
  mode: "dark",
  primary: {
    main: "#8FB7FF",
    contrastText: "#052040",
  },
  secondary: {
    main: "#9FA7C3",
    contrastText: "#0F1720",
  },
  error: {
    main: "#FF8A80",
    contrastText: "#3B0000",
  },
  background: {
    default: "#0E1114",
    paper: "#0F1519",
  },
  text: {
    primary: "#E6E8EC",
    secondary: "#BFC4D0",
  },
  divider: "#2F3440",
  action: {
    hover: "rgba(143,183,255,0.08)",
    selected: "rgba(143,183,255,0.14)",
  },
};

export const lightTheme = createTheme({
  palette: lightPalette,
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: 'Inter, Roboto, "Helvetica Neue", Arial',
    h1: { fontSize: '1.75rem', fontWeight: 600 },
    h2: { fontSize: '1.25rem', fontWeight: 600 },
    body1: { fontSize: '0.95rem' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiAppBar: {
      defaultProps: { elevation: 0 },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: darkPalette,
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: 'Inter, Roboto, "Helvetica Neue", Arial',
    h1: { fontSize: '1.75rem', fontWeight: 600 },
    h2: { fontSize: '1.25rem', fontWeight: 600 },
    body1: { fontSize: '0.95rem' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiAppBar: {
      defaultProps: { elevation: 0 },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

export function getThemeForSystem(prefersDark: boolean) {
  return prefersDark ? darkTheme : lightTheme;
}

export default lightTheme;
