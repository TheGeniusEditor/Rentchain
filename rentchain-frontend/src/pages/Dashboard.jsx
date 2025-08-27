import { useEffect, useState } from "react";
import { Container, Typography, Card, CardContent } from "@mui/material";
import { getPropertiesByOwner } from "../api/rentchain";
const landlordAddress = "0x85f6FfCD9072d5Cf33EFE4b067100F267F32b20D"; // Replace or connect wallet

export default function Dashboard() {
  const [properties, setProperties] = useState([]);
  useEffect(() => { getPropertiesByOwner(landlordAddress).then(setProperties); }, []);
  return (
    <Container maxWidth="lg" sx={{ mt: 6 }}>
      <Typography variant="h4" fontWeight={900} mb={4}>My Properties</Typography>
      {properties.map(property => (
        <Card key={property._id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">{property.title}</Typography>
            <Typography>{property.description}</Typography>
            <Typography>Status: {property.status}</Typography>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
}
