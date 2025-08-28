import { useEffect, useState } from "react";
import { Container, Typography, Card, CardContent, Box } from "@mui/material";
import { getPropertiesByOwner } from "../api/rentchain";
import StatusChip from "../components/StatusChip";
const landlordAddress = "0x85f6FfCD9072d5Cf33EFE4b067100F267F32b20D"; // Use real address

export default function Dashboard() {
  const [properties, setProperties] = useState([]);
  useEffect(() => { getPropertiesByOwner(landlordAddress).then(setProperties); }, []);
  return (
    <Container maxWidth="lg" sx={{ mt: 6 }}>
      <Typography variant="h4" fontWeight={900} mb={4}>My Properties</Typography>
      {properties.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 4 }}>
          No properties found for your account.<br />
        </Typography>
      ) : (
        properties.map(property => (
          <Card key={property._id} sx={{ mb: 2 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <Typography variant="h6">{property.title}</Typography>
                <StatusChip status={property.status} />
              </Box>
              <Typography>{property.description}</Typography>
              <Typography>Status: {property.status}</Typography>
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
}
