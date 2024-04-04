import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setTrip } from "../store/tripSlice";
import { saveAs } from "file-saver";
import { Button, Card, Grid, Typography } from "@mui/material";
import AcrgisMap from "../components/AcrgisMap";
import PlacesSlide from "../components/AddPlaces";
import AddNotes from "../components/AddNotes";
import AddFriend from "../components/AddFriend";
import PlacesList from "../components/PlacesList";
import NotesList from "../components/NotesList";
import { useEffect } from "react";
export default function Trips() {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const trip = state.trip;
  console.log(trip);
  dispatch(setTrip(trip));
  const loadTrip = async () => {
    const res = await fetch(`/api/trip/${trip.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    console.log(data);
    dispatch(setTrip(data));
  };
  useEffect(() => {
    loadTrip();
  }, []);
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
    });
  };
  const handlePdf = async () => {
    console.log("pdf");
    const response = await fetch(`/api/pdf/${trip.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.blob()
    const blob = new Blob([data], { type: "application/pdf" });
    saveAs(blob, "trip.pdf");
    console.log(response);
  };

  return (
    <Grid
      container
      sx={{
        display: "flex",
        flexDirection: "row",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        backgroundColor: "#FFFFFF",
      }}
    >
      <Grid
        item
        sx={{
          width: "50%",
        }}
      >
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
        <AddNotes />
        <AddFriend />
        <PlacesList />
        <NotesList />
        <Button
          variant="contained"
          color="primary"
          sx={{ margin: "10px" }}
          onClick={handlePdf}
        >
          Create PDF of Trip
        </Button>
      </Grid>
      <Grid sx={{ width: "50%" }}>
        <AcrgisMap />
      </Grid>
    </Grid>
  );
}
