import { Typography, Card, TextField, Box, Button } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { useDispatch, useSelector } from "react-redux";
import { addTrip } from "../store/tripsSlice";

export default function AddTrip() {
  const token = useSelector((state) => state.auth.token); 
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    destination: "",
    from: null,
    to: null,
  });
  const onSubmit = async () => {
    if (form.destination && form.from && form.to) {
      console.log(form);
      const res = await fetch(
        `http://localhost:3001/geocoding?address=${form.destination}`,
        {
          method: "GET",
        }
      );
      const data = await res.json();
      console.log(data);
      if (data.e) {
        alert("Invalid Address");
        return;
      }
      const res1 = await fetch("http://localhost:3001/trip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          destination: form.destination,
          from: new Date(form.from).toISOString(),
          to: new Date(form.to).toISOString(),
          coordinates: {
            x: data.x,
            y: data.y,
          },
        }),
      });
      const addedTrip = await res1.json();
      if (res1.ok) {
        alert("Trip Added Successfully");
        setForm({
          destination: "",
          from: null,
          to: null,
        });
        dispatch(addTrip(addedTrip));
      }
    } else {
      alert("Please fill all the fields");
    }
  };
  return (
    <>
      <Card sx={{ padding: "20px", marginBottom: "20px" }}>
        <Typography variant="h6" sx={{ marginBottom: "10px" }}>
          Add New Trip
        </Typography>
        <Card sx={{ padding: "10px" }}>
          <Box
            display="flex"
            alignItems="center"
            sx={{ padding: "10px" }}
          >
            <TextField
              id="destination"
              label="Destination"
              variant="outlined"
              value={form.destination}
              onChange={(e) =>
                setForm({ ...form, destination: e.target.value })
              }
              sx={{ marginRight: "10px" }}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateRangePicker
                localeText={{ start: "From", end: "To" }}
                onChange={(newValue) => {
                  setForm({ ...form, from: newValue[0], to: newValue[1] });
                }}
                value={[form.from, form.to]}
              />
            </LocalizationProvider>
            <Button variant="contained" color="primary" sx={{margin : '10px'}} onClick={onSubmit}>
              Submit
            </Button>
          </Box>
        </Card>
      </Card>
    </>
  );
}
