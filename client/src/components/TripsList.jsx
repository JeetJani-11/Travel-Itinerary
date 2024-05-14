import { useSelector } from "react-redux";
import TripCard from "./TripCard";
import { Card } from "@mui/material";

export default function TripsList() {
  const trips = useSelector((state) => state.trips.trips);
  return (
      <Card
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          padding: "20px",
        }}
      >
        {trips.map((trip) => (
          <TripCard key={trip._id} trip={trip} />
        ))}
      </Card>
   
  );
}
