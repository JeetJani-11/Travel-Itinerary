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
import { Navigate } from "react-router-dom";
import formatDate from "../utils/formatDate";
import NotesList from "../components/NotesList";

export default function Trips() {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  if (!state) {
    return <Navigate to="/home" />;
  }
  const trip = state.trip;
  
  dispatch(setTrip(trip));

  const handlePdf = async () => {
    console.log("pdf");
    const response = await fetch(`/api/pdf/${trip.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.blob();
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
