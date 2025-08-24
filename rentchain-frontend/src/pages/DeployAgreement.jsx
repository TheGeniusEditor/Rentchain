import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";
import { deployAgreement } from "../api/rentchain";

export default function DeployAgreement() {
  const [form, setForm] = useState({
    renter: "",
    ipfsHash: "",
    rentEth: "",
    depositEth: "",
    duration: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult("");
    try {
      const response = await deployAgreement(form);
      setResult(`Deployed to: ${response.address}`);
    } catch (err) {
      setError("Failed to deploy contract.");
    }
    setLoading(false);
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
      <Paper elevation={4} sx={{ p: 4, background: "#f4f8fb" }}>
        <Typography variant="h4" fontWeight={900} align="center" color="primary" gutterBottom>
          Deploy New Rental Agreement
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Box
          component="form"
          onSubmit={handleSubmit}
          autoComplete="off"
          sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Renter Address"
            name="renter"
            value={form.renter}
            onChange={handleChange}
            required
            fullWidth
            helperText="Ethereum address of the renter"
          />
          <TextField
            label="Property IPFS Hash"
            name="ipfsHash"
            value={form.ipfsHash}
            onChange={handleChange}
            required
            fullWidth
            helperText="IPFS hash for your property details/files"
          />
          <TextField
            label="Rent (ETH)"
            name="rentEth"
            type="number"
            value={form.rentEth}
            onChange={handleChange}
            required
            fullWidth
            helperText="Monthly rent in ETH"
          />
          <TextField
            label="Deposit (ETH)"
            name="depositEth"
            type="number"
            value={form.depositEth}
            onChange={handleChange}
            required
            fullWidth
            helperText="Security deposit in ETH"
          />
          <TextField
            label="Duration (days)"
            name="duration"
            type="number"
            value={form.duration}
            onChange={handleChange}
            required
            fullWidth
            helperText="Rental period (number of days)"
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            size="large"
            disabled={loading}
            sx={{ fontWeight: 700, py: 1.5, fontSize: 18 }}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : "Deploy Agreement"}
          </Button>
        </Box>
        {result && (
          <Alert severity="success" sx={{ mt: 3, fontWeight: 600, fontSize: 15 }}>
            {result}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 3, fontWeight: 600, fontSize: 15 }}>
            {error}
          </Alert>
        )}
      </Paper>
    </Container>
  );
}
