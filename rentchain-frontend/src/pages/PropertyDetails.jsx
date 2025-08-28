import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Paper, Typography, Button, Alert, Box } from "@mui/material";
import { getProperty, getAgreement, activateAgreement, terminateAgreement } from "../api/rentchain";
import StatusChip from "../components/StatusChip";

export default function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState({});
  const [agreement, setAgreement] = useState({});
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  useEffect(() => { getProperty(id).then(setProperty); }, [id]);
  useEffect(() => {
    if (property.contractAddress)
      getAgreement(property.contractAddress).then(setAgreement);
  }, [property.contractAddress]);

  const handleActivate = async () => {
    if (property.status !== "available") return;
    try {
      const res = await activateAgreement({
        contractAddress: property.contractAddress,
        rentEth: property.rentEth,
        depositEth: property.depositEth
      });
      if (!res.success) throw new Error(res.error || "Activation failed");
      setResult("Agreement Activated!");
      setError("");
      setProperty(prev => ({ ...prev, status: "occupied" }));
      getAgreement(property.contractAddress).then(setAgreement);
    } catch (e) {
      setError("Activation failed: " + e.message);
      setResult("");
    }
  };

  const handleTerminate = async () => {
    if (property.status === "terminated") return;
    try {
      const res = await terminateAgreement({ contractAddress: property.contractAddress });
      if (!res.success) throw new Error(res.error || "Termination failed");
      setResult("Agreement Terminated!");
      setError("");
      setProperty(prev => ({ ...prev, status: "terminated" }));
      getAgreement(property.contractAddress).then(setAgreement);
    } catch (e) {
      setError("Termination failed: " + e.message);
      setResult("");
    }
  };

  return (
    <Container sx={{ mt: 6 }}>
      <Paper elevation={4} sx={{ p: 4 }}>
        {property.imageUrl && (
          <img
            src={property.imageUrl}
            alt={property.title}
            style={{
              width: "100%",
              maxHeight: 280,
              objectFit: "cover",
              borderRadius: 12,
              marginBottom: 12,
            }}
          />
        )}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography variant="h5" fontWeight={900}>{property.title}</Typography>
          <StatusChip status={property.status} />
        </Box>
        <Typography variant="body1" mb={2}>{property.description}</Typography>
        <Typography>Rent: {property.rentEth} ETH</Typography>
        <Typography>Deposit: {property.depositEth} ETH</Typography>
        <Typography>Owner: {property.owner}</Typography>
        <Typography>IPFS Hash: {property.ipfsHash}</Typography>
        <Box mt={2} display="flex">
          <Button
            variant="contained"
            color="success"
            disabled={property.status !== "available"}
            onClick={handleActivate}
            sx={{ mr: 2 }}
          >
            Activate Agreement
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={property.status === "terminated"}
            onClick={handleTerminate}
          >
            Terminate Agreement
          </Button>
        </Box>
        {result && <Alert severity="success" sx={{ mt: 2 }}>{result}</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Paper>
    </Container>
  );
}
