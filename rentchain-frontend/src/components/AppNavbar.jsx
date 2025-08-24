import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

export default function AppNavbar() {
  const location = useLocation();
  return (
    <AppBar position="sticky" elevation={3} color="primary">
      <Toolbar sx={{ minHeight: 72 }}>
        <img src="/logo192.png" alt="Logo" style={{ width: 40, marginRight: 16 }} />
        <Typography variant="h5" fontWeight={900} sx={{ letterSpacing: 1, flexGrow: 1 }}>
          RentChain
        </Typography>
        <Button
          color="inherit"
          component={Link}
          to="/"
          sx={{
            borderBottom: location.pathname === "/" ? "3px solid #fff" : "none",
            borderRadius: 0
          }}>
          Dashboard
        </Button>
        <Button
          color="inherit"
          component={Link}
          to="/deploy"
          sx={{
            borderBottom: location.pathname === "/deploy" ? "3px solid #fff" : "none",
            borderRadius: 0
          }}>
          Deploy
        </Button>
      </Toolbar>
    </AppBar>
  );
}
