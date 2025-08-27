import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Listings from "./pages/Listings";
import DeployAgreement from "./pages/DeployAgreement";
import PropertyDetails from "./pages/PropertyDetails";
import Dashboard from "./pages/Dashboard";
import AppNavbar from "./components/AppNavbar";

export default function App() {
  return (
    <>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<Listings />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/deploy" element={<DeployAgreement />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}
