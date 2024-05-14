import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import "swiper/css";
import "swiper/css/pagination";
import { useDispatch } from "react-redux";
import { addPlace } from "../store/tripSlice";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

export default function PlacesDetail ({from , to , date, place, tripId }) {
    const token = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();
    const addPlacehandler = async (place) => {
      console.log(place);
      if(date >  dayjs(to) || date < dayjs(from)){
        alert("Please select a date between trip start and end date");
        return;
      }
      const res = await fetch(`/api/addPlaces/${tripId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: place.name,
         date,
          location: place.location,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(addPlace({ place: data, date }));
      }
      console.log(res);
    };
  
    return (
      <Card sx={{ marginBottom: 2 }}>
        <CardContent>
          <Typography variant="h6" component="div" sx={{ marginBottom: 1 }}>
            {place.name}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            sx={{ marginTop: 1 }}
            onClick={() => {
              addPlacehandler(place);
            }}
          >
            Add Place
          </Button>
        </CardContent>
      </Card>
    );
  };
  