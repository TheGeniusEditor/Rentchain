// src/components/AppNavbar.jsx
import { AppBar, Toolbar, Typography, Button, Avatar, Box } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Link } from "react-router-dom";

export default function AppNavbar() {
  return (
    <AppBar position="sticky" color="primary" elevation={5}>
      <Toolbar sx={{ minHeight: 72 }}>
        <Typography variant="h5" fontWeight={900} sx={{ flexGrow: 1, letterSpacing: 1 }}>RentChain</Typography>
        <Button color="inherit" component={Link} to="/listings">Listings</Button>
        <Button color="inherit" component={Link} to="/deploy">Deploy</Button>
        <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
        <Box mx={2}><NotificationsIcon fontSize="large" /></Box>
        <Avatar alt="User" src="/static/avatar.png" />
      </Toolbar>
    </AppBar>
  );
}
