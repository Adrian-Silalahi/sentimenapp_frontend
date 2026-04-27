import { createTheme } from "@mui/material";

export const dataExtractionTheme = createTheme({
  palette: {
    primary: {
      main: "#2196f3", // Bright pink
    },
    secondary: {
      main: "#00B0FF", // Bright blue (cth, untuk icons)
    },
    downloadButton: "rgb(10, 92, 92)", // Green download button
    background: {
      default: "#f0f2f5", // Light gray untuk background
      paper: "#ffffff", // Component (container) background
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h4: {
      fontWeight: 600,
      color: "#333", // Title text color
    },
    h6: {
      fontWeight: 500,
      color: "#555",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: "10px 20px",
          borderRadius: "8px",
          textTransform: "none",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
        },
      },
    },
  },
});
