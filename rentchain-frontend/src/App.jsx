import React from "react";
import { Routes, Route } from "react-router-dom";
import { Container, Box } from "@mui/material";
import Listings from "./pages/Listings";
import DeployAgreement from "./pages/DeployAgreement";
import PropertyDetails from "./pages/PropertyDetails";
import Dashboard from "./pages/Dashboard";
import AppNavbar from "./components/AppNavbar";
import Chatbot from "./components/Chatbot";
import AnimatedPage from "./components/AnimatedPage";
import './App.css';

export default function App() {
  return (
    <Box className="app-content">
      <AppNavbar />
      <Container maxWidth="xl" className="page-container">
        <Routes>
          <Route path="/" element={<AnimatedPage><Listings /></AnimatedPage>} />
          <Route path="/listings" element={<AnimatedPage><Listings /></AnimatedPage>} />
          <Route path="/deploy" element={<AnimatedPage><DeployAgreement /></AnimatedPage>} />
          <Route path="/property/:id" element={<AnimatedPage><PropertyDetails /></AnimatedPage>} />
          <Route path="/dashboard" element={<AnimatedPage><Dashboard /></AnimatedPage>} />
        </Routes>
      </Container>
      <Chatbot />
    </Box>
  );
}
