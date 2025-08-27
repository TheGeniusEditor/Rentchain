import { useEffect, useState } from "react";
import { Container, Grid, Card, CardMedia, CardContent, Chip, Typography, Button, Box } from "@mui/material";
import { getProperties } from "../api/rentchain";
import { Link } from "react-router-dom";

export default function Listings() {
  const [properties, setProperties] = useState([]);
  useEffect(() => { getProperties().then(setProperties); }, []);
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" fontWeight={900} mb={4}>Property Listings</Typography>
      <Grid container spacing={4}>
        {properties.map(p => (
          <Grid item xs={12} md={6} lg={4} key={p._id}>
            <Card sx={{ transition: "0.2s", "&:hover": { boxShadow: 8, transform: "scale(1.02)" } }}>
              <CardMedia image={p.imageUrl || "/static/sample-property.jpg"} sx={{ height: 160 }} />
              <CardContent>
                <Typography variant="h6" fontWeight={900}>{p.title}</Typography>
                <Chip label={p.status === "available" ? "Available" : "Terminated"} color={p.status === "available" ? "success" : "error"} />
                <Typography variant="body2">{p.description}</Typography>
                <Box my={1}>
                  <Chip label={`Rent: ${p.rentEth} ETH`} />
                  <Chip label={`Deposit: ${p.depositEth} ETH`} sx={{ ml: 1 }} />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Owner: {p.owner.substring(0, 8)}...{p.owner.substring(p.owner.length - 4)}
                </Typography>
              </CardContent>
              <Button component={Link} to={`/property/${p._id}`} variant="contained" color="primary" sx={{ m: 2 }}>View</Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
