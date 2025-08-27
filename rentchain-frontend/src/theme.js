import { createTheme } from "@mui/material/styles";
const theme = createTheme({
  palette: {
    primary: { main: "#0052cc" },
    secondary: { main: "#34b233" },
    background: { default: "#f7f9fb", paper: "#fff" },
    error: { main: "#e53935" },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: { fontWeight: 900 }, h4: { fontWeight: 700 },
  },
  shape: { borderRadius: 18 },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 8, fontWeight: 700 } } },
    MuiCard: { styleOverrides: { root: { boxShadow: "0 4px 24px rgba(40,60,100,0.10)" } } },
  },
});
export default theme;
