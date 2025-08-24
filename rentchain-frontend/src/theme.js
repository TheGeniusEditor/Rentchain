import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0052cc' },
    secondary: { main: '#ffb300' },
    background: {
      default: '#f4f8fb',
      paper: '#fff',
    },
    success: { main: '#34b233' },
    error: { main: '#e53935' },
    info: { main: '#0288d1' },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h4: { fontWeight: 900 },
    h6: { fontWeight: 700 },
    button: { fontWeight: 700 },
  },
  shape: { borderRadius: 14 },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: 'none' } } },
    MuiCard: { styleOverrides: { root: { boxShadow: "0px 4px 24px rgba(40,60,100,0.10)" } } },
  }
});
export default theme;
