import React, { useState } from "react";
import { addProperty, deployAgreement } from "../api/rentchain";
import { Container, Paper, TextField, Typography, Button, Alert } from "@mui/material";

export default function DeployAgreement() {
  const [form, setForm] = useState({
    renter: "", title: "", description: "", ipfsHash: "", rentEth: "", depositEth: "", duration: "", owner: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  function handleImageUpload(e) {
    setImageFile(e.target.files[0]);
  }

  async function uploadImageViaBackend(file) {
    const formData = new FormData();
    formData.append('image', file);
    const response = await fetch('http://localhost:3000/upload-image', {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Image upload failed');
    const data = await response.json();
    return data.imageUrl;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setResult(""); setError("");
    let imageUrl = "";
    try {
      if (imageFile) {
        imageUrl = await uploadImageViaBackend(imageFile);
      }
      const deployRes = await deployAgreement({
        renter: form.renter,
        ipfsHash: form.ipfsHash,
        rentEth: form.rentEth,
        depositEth: form.depositEth,
        duration: form.duration
      });
      await addProperty({
        ...form,
        contractAddress: deployRes.address,
        imageUrl
      });
      setResult("Agreement Deployed and Property Listed!");
      setImageFile(null);
      setForm({ renter: "", title: "", description: "", ipfsHash: "", rentEth: "", depositEth: "", duration: "", owner: "" });
    } catch (e) {
      setError("Failed to deploy: " + e.message);
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" fontWeight={900}>Deploy New Rental Agreement</Typography>
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            required
            style={{ marginBottom: 16 }}
          />
          {imageFile && (
            <img
              src={URL.createObjectURL(imageFile)}
              alt="Preview"
              style={{
                width: "100%",
                maxHeight: 140,
                objectFit: "cover",
                borderRadius: 8,
                marginBottom: 8,
              }}
            />
          )}
          {["title", "description", "ipfsHash", "renter", "rentEth", "depositEth", "duration", "owner"].map(field => (
            <TextField
              key={field}
              name={field}
              value={form[field]}
              onChange={handleChange}
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              fullWidth
              sx={{ mb: 2 }}
              required
            />
          ))}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Deploy & List
          </Button>
        </form>
        {result && <Alert severity="success" sx={{ mt: 2 }}>{result}</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Paper>
    </Container>
  );
}
