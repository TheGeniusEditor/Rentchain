import React, { useEffect, useState } from "react";
import {
  Container, Box, Paper, TextField, Card, CardContent,
  Typography, Chip, Button, CircularProgress, Grid, Divider, Alert, Fade
} from "@mui/material";
import { getAgreement, getStatus, activateAgreement, terminateAgreement } from "../api/rentchain";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

function statusProps(status) {
  switch (status) {
    case "Active":
      return { color: "success", icon: <CheckCircleIcon color="success" sx={{ fontSize: 40 }} /> };
    case "Terminated":
      return { color: "error", icon: <BlockIcon color="error" sx={{ fontSize: 40 }} /> };
    default:
      return { color: "info", icon: <HourglassEmptyIcon color="info" sx={{ fontSize: 40 }} /> };
  }
}

export default function Dashboard() {
  const [contractAddress, setContractAddress] = useState("");
  const [agreement, setAgreement] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function mapStatus(data) {
    if (data.isTerminated) return "Terminated";
    if (data.isActive) return "Active";
    return "Inactive";
  }

  useEffect(() => {
    if (contractAddress && contractAddress.length === 42) {
      setLoading(true);
      Promise.all([
        getAgreement(contractAddress),
        getStatus(contractAddress)
      ])
        .then(([agreementRes, statusRes]) => {
          setAgreement(agreementRes);
          setStatus(mapStatus(statusRes));
          setError("");
        })
        .catch(() => {
          setAgreement(null);
          setError("Failed to load agreement details.");
        })
        .finally(() => setLoading(false));
    } else {
      setAgreement(null);
      setStatus("");
    }
  }, [contractAddress]);

  async function handleActivate() {
    setLoading(true);
    setError("");
    try {
      await activateAgreement({
        contractAddress,
        rentEth: agreement.rentAmount,
        depositEth: agreement.depositAmount
      });
      const data = await getStatus(contractAddress);
      setStatus(mapStatus(data));
    } catch {
      setError("Activation failed.");
    }
    setLoading(false);
  }

  async function handleTerminate() {
    setLoading(true);
    setError("");
    try {
      await terminateAgreement(contractAddress);
      const data = await getStatus(contractAddress);
      setStatus(mapStatus(data));
    } catch {
      setError("Termination failed.");
    }
    setLoading(false);
  }

  const { icon, color } = statusProps(status);

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 10 }}>
      <Paper elevation={5} sx={{ p: { xs: 2, md: 4 }, mb: 3, background: "#f4f8fb" }}>
        <Typography variant="h4" fontWeight={900} color="primary.main">
          Rental Agreement Dashboard
        </Typography>

        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
          Enter or paste your contract address to unlock agreement details, status, and controls.
        </Typography>

        <TextField
          label="Contract Address"
          value={contractAddress}
          onChange={e => setContractAddress(e.target.value)}
          placeholder="e.g. 0x..."
          fullWidth
          margin="normal"
          variant="outlined"
          sx={{
            mb: 3,
            background: "#fff",
            fontWeight: 600,
            borderRadius: 2
          }}
        />

        {loading && (
          <Fade in={loading}><Box display="flex" justifyContent="center" my={2}>
            <CircularProgress size={40} thickness={6} />
          </Box></Fade>
        )}

        {error && (
          <Alert severity="error" sx={{ my: 1, fontWeight: 600 }}>{error}</Alert>
        )}

        <Fade in={Boolean(agreement)}>
          <div>
            {agreement && (
              <Card sx={{ mt: 2, background: "#fff" }}>
                <CardContent>
                  <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={8}>
                      <Typography variant="h6" color="primary" fontWeight={700} gutterBottom>
                        Agreement Details
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1.5 }}>
                        <b>Landlord:</b> {agreement.landlord}<br />
                        <b>Renter:</b> {agreement.renter}<br />
                        <b>Property IPFS:</b> {agreement.propertyIPFSHash}<br />
                        <b>Rent:</b> {agreement.rentAmount} ETH<br />
                        <b>Deposit:</b> {agreement.depositAmount} ETH<br />
                        <b>Duration:</b> {agreement.rentalDuration} days
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4} align="center">
                      <Typography variant="caption" color={color}>Status</Typography>
                      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 1, mb: 2 }}>
                        {icon}
                        <Chip
                          label={status || "Unknown"}
                          color={color}
                          variant="filled"
                          sx={{
                            fontWeight: 900,
                            fontSize: 18,
                            minWidth: 120,
                            mt: 1,
                            letterSpacing: 1
                          }}
                          size="large"
                        />
                      </Box>
                      <Divider sx={{ mb: 2 }} />

                      <Button
                        variant="contained"
                        color="success"
                        onClick={handleActivate}
                        fullWidth
                        size="large"
                        disabled={loading || status === "Active" || status === "Terminated"}
                        sx={{ mb: 1, fontWeight: 700 }}
                      >
                        Activate
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={handleTerminate}
                        fullWidth
                        size="large"
                        disabled={loading || status === "Terminated"}
                        sx={{ fontWeight: 700 }}
                      >
                        Terminate
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}
          </div>
        </Fade>

        {!agreement && !loading && (
          <Alert severity="info" sx={{ mt: 2, fontWeight: 500 }}>
            Enter a contract address above to view its details and status.
          </Alert>
        )}
      </Paper>
    </Container>
  );
}
