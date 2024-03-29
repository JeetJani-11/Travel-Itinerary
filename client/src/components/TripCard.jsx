import { Card } from "@mui/material";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
export default function TripCard({ trip }) {
    const navigate = useNavigate();
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
    });
  };

  const handleClick = () => {
    navigate(`/trip` , { state: { trip } });
  }
  return (
    <Card
      sx={{
        margin: "10px",
        padding: "10px",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
      }}
      onClick={handleClick}
    >
      <Typography variant="h6">{trip.destination}</Typography>
      <Typography variant="body1">
        {formatDate(trip.from)} - {formatDate(trip.to)}
      </Typography>
    </Card>
  );
}
