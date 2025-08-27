import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Paper, Typography, Button, Alert, Chip, Box } from "@mui/material";
import { getProperty, getAgreement, activateAgreement, terminateAgreement } from "../api/rentchain";
import QrCode2Icon from "@mui/icons-material/QrCode2";

export default function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState({});
  const [agreement, setAgreement] = useState({});
  const [result, setResult] = useState(""); 
  const [error, setError] = useState("");

  useEffect(() => { getProperty(id).then(setProperty); }, [id]);
  useEffect(() => { if (property.contractAddress) getAgreement(property.contractAddress).then(setAgreement); }, [property.contractAddress]);

  const handleActivate = async () => {
    try {
      await activateAgreement({ contractAddress: property.contractAddress, rentEth: property.rentEth, depositEth: property.depositEth });
      setResult("Agreement Activated!"); setError("");
      getAgreement(property.contractAddress).then(setAgreement);
    } catch (e) { setError("Activation failed"); setResult(""); }
  };
  const handleTerminate = async () => {
    try {
      await terminateAgreement({ contractAddress: property.contractAddress });
      setResult("Agreement Terminated!"); setError("");
      getAgreement(property.contractAddress).then(setAgreement);
    } catch (e) { setError("Termination failed"); setResult(""); }
  };

  return (
    <Container sx={{ mt: 6 }}>
      <Paper elevation={4} sx={{ p: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography variant="h5" fontWeight={900}>{property.title}</Typography>
          <Chip label={agreement.isActive ? "Active" : agreement.isTerminated ? "Terminated" : "Inactive"} color={agreement.isActive ? "info" : agreement.isTerminated ? "error" : "default"} sx={{ ml: 2 }} />
          <QrCode2Icon sx={{ ml: 2, fontSize: 30 }} />
        </Box>
        <Typography variant="body1" mb={2}>{property.description}</Typography>
        <Typography>Rent: {property.rentEth} ETH</Typography>
        <Typography>Deposit: {property.depositEth} ETH</Typography>
        <Typography>Owner: {property.owner}</Typography>
        <Typography>IPFS Hash: {property.ipfsHash}</Typography>
        <Button variant="contained" color="success" disabled={agreement.isActive || agreement.isTerminated} onClick={handleActivate} sx={{ mt: 2, mr: 2 }}>Activate Agreement</Button>
        <Button variant="contained" color="error" disabled={agreement.isTerminated} onClick={handleTerminate} sx={{ mt: 2 }}>Terminate Agreement</Button>
        {result && <Alert severity="success" sx={{ mt: 2 }}>{result}</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Paper>
    </Container>
  );
}
