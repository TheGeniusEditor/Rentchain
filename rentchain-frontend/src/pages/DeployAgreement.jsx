import { useState } from "react";
import { deployAgreement, addProperty } from "../api/rentchain";
import { Container, Paper, TextField, Typography, Button, Alert } from "@mui/material";

export default function DeployAgreement() {
  const [form, setForm] = useState({ renter: "", title: "", description: "", ipfsHash: "", rentEth: "", depositEth: "", duration: "", owner: "" });
  const [result, setResult] = useState(""); 
  const [error, setError] = useState("");
  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }
  async function handleSubmit(e) {
    e.preventDefault();
    setResult(""); setError("");
    try {
      const deployRes = await deployAgreement({ renter: form.renter, ipfsHash: form.ipfsHash, rentEth: form.rentEth, depositEth: form.depositEth, duration: form.duration });
      await addProperty({ ...form, contractAddress: deployRes.address });
      setResult("Agreement Deployed and Property Listed!");
    } catch (e) { setError("Failed to deploy: " + e.message); }
  }
  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4">Deploy New Rental Agreement</Typography>
        <form onSubmit={handleSubmit}>
          {["title", "description", "ipfsHash", "renter", "rentEth", "depositEth", "duration", "owner"].map(field => (
            <TextField key={field} name={field} value={form[field]} onChange={handleChange} label={field.charAt(0).toUpperCase()+field.slice(1)} fullWidth sx={{ mb: 2 }} required />
          ))}
          <Button type="submit" variant="contained" color="primary" fullWidth>Deploy & List</Button>
        </form>
        {result && <Alert severity="success" sx={{ mt: 2 }}>{result}</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Paper>
    </Container>
  );
}
