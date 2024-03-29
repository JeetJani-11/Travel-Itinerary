import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setTrip } from "../store/tripSlice";
import { Card , Typography } from "@mui/material";

import PlacesSlide from "../components/AddPlaces";
export default function Trips() {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const trip = state.trip;
  console.log(trip);
  dispatch(setTrip(trip));
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
    });
  };

  return (
    <div>
      <Card
        sx={{
          margin: "10px",
          padding: "10px",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
        }}
      >
        <Typography variant="h6">{trip.destination}</Typography>
        <Typography variant="body1">
          {formatDate(trip.from)} - {formatDate(trip.to)}
        </Typography>
      </Card>
      <PlacesSlide />
    </div>
  );
}
