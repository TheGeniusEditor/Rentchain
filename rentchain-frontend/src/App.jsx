import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useLocation, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import DeployAgreement from "./pages/DeployAgreement";

function AppNavbar() {
  const location = useLocation();
  return (
    <AppBar position="sticky" color="primary" elevation={3}>
      <Toolbar sx={{ minHeight: 72 }}>
        {/* Add your logo here if you want */}
        <Typography variant="h5" fontWeight={900} sx={{ flexGrow: 1, letterSpacing: 1 }}>
          RentChain
        </Typography>
        <Box>
          <Button
            color="inherit"
            component={Link}
            to="/"
            sx={{
              borderBottom: location.pathname === "/" ? "3px solid #fff" : "none",
              borderRadius: 0,
              fontWeight: 700,
              fontSize: 16
            }}
          >
            Dashboard
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/deploy"
            sx={{
              borderBottom: location.pathname === "/deploy" ? "3px solid #fff" : "none",
              borderRadius: 0,
              fontWeight: 700,
              fontSize: 16
            }}
          >
            Deploy
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default function App() {
  return (
    <>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/deploy" element={<DeployAgreement />} />
      </Routes>
    </>
  );
}
