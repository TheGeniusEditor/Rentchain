import { Chip } from "@mui/material";
export default function StatusChip({ status }) {
  return (
    <Chip
      label={
        status === "available" ? "Available"
        : status === "occupied" ? "Occupied"
        : "Terminated"
      }
      color={
        status === "available" ? "success"
        : status === "occupied" ? "info"
        : "error"
      }
      sx={{ ml: 2 }}
    />
  );
}
