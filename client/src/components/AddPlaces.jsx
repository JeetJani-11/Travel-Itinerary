import React, { useState, useEffect, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Card from "@mui/material/Card";
import { TextField } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import "swiper/css";
import PlacesDetail from './PlaceDetail';
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useDispatch, useSelector } from "react-redux";
import { addPlace } from "../store/tripSlice";

const Categories = [
  { label: "Landmarks and Outdoors", code: 16000 },
  { label: "Dining and Drinking", code: 13000 },
  { label: "Event", code: 14000 },
  { label: "Sports and Recreation", code: 18000 },
  { label: "Arts and Entertainment", code: 10000 },
  { label: "Travel and Transportation", code: 19000 },
  { label: "", code: 0 },
];

const PlacesSlide = () => {
  const { trip, auth } = useSelector((state) => state);
  const { token } = auth;
  const { coordinates, places, _id: tripId } = trip.trip;
  const [recommendation, setRecommendation] = useState([]);
  const [date, setDate] = useState(dayjs(trip.trip.from));
  const [loading, setLoading] = useState(false);
  const [nearby, setNearby] = useState({});
  const [category, setCategory] = useState();
  const [customPlaceName, setCustomPlaceName] = useState("");
  const [isCustom, setIsCustom] = useState(false);

  const dispatch = useDispatch();

  const fetchNearbyPlaces = useCallback(async (event) => {
    setLoading(true);
    const placeCode = event.target.value;
    if (nearby[event.target.value]) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`/api/nearby?x=${coordinates.x}&y=${coordinates.y}&categoryIds=${event.target.value}`, {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const nearbyJson = await res.json();
      const obj = {};
      obj[placeCode] = nearbyJson.places;
      setNearby((prevNearby) => ({ ...prevNearby, ...obj }));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching nearby places:", error);
      setLoading(false);
    }
  }, [coordinates, nearby, token]);

  const addCustomPlace = useCallback(async () => {
    try {
      if(date < dayjs(trip.trip.from) || date > dayjs(trip.trip.to)) {  
        alert("Please select a date within the trip dates")
        return
      }
      console.log(customPlaceName);
      const res = await fetch(`/api/addPlaces/${tripId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: customPlaceName + " " + trip.trip.destination,
          date,
          location: { x: -1, y: -1 },
        }),
      });
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        dispatch(addPlace({ place: data, date }));
      }
    } catch (error) {
      console.error("Error adding custom place:", error);
    }
  }, [customPlaceName, date, dispatch, token, trip.trip.destination, tripId]);

  useEffect(() => {
    const fetchReccomendations = async () => {
      try {
        if (!trip.trip.destination) {
          console.error("Trip destination is undefined");
          return;
        }
        const res = await fetch(`/api/search/trips/${trip.trip.destination}`, {
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        console.error(data);
        setRecommendation(data);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };
    fetchReccomendations()
  }, [trip, token]);
  return (
    <Card style={{ margin: "10px", padding: "10px", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", borderRadius: "8px" }}>
      <FormControlLabel
        control={<Switch checked={isCustom} onChange={() => setIsCustom(!isCustom)} />}
        label="Custom Place"
        style={{ marginBottom: "10px" }}
      />
      {isCustom ? (
        <Card sx={{'display' : 'flex' , 'flexDirection' : 'column'}}>
          <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ margin: "15px"  }}>
            <DatePicker label="Controlled picker" value={date} sx={{ margin: "15px"  }} onChange={(newValue) => setDate(newValue)} />
          </LocalizationProvider>
          <Swiper slidesPerView={3} spaceBetween={30} pagination={{ clickable: true }} style={{ margin: "20px" }}>
            {recommendation?.map((place, index) => {
              const isExistingPlace = places.some((item) => item.place.name === place.name);
              if (!isExistingPlace) {
                return (
                  <SwiperSlide key={index}>
                    <PlacesDetail date={date} place={place} tripId={tripId} />
                  </SwiperSlide>
                );
              }
              return null;
            })}
          </Swiper>
          <TextField
            label="Add Custom Place"
            onChange={(event) => {
              setCustomPlaceName(event.target.value);
            }}
            value={customPlaceName}
            style={{ marginBottom: "10px" }}
          />
          <Button variant="contained" color="primary" style={{ margin: "10px" }} onClick={addCustomPlace}>
            Add Custom Place
          </Button>
        </Card>
      ) : (
        <>
          <FormControl fullWidth style={{ margin: "5px" }}>
            <InputLabel id="demo-simple-select-label">Category</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={category}
              displayEmpty={false}
              defaultValue={0}
              label="Category"
              onChange={(event) => {
                setCategory(event.target.value);
                fetchNearbyPlaces(event);
              }}
              style={{ marginBottom: "10px" }}
            >
              {Categories.map((category, index) => (
                <MenuItem key={index} value={category.code}>
                  {category.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDayjs} style={{ margin: "5px" }}>
            <DatePicker label="Controlled picker" value={date} onChange={(newValue) => setDate(newValue)} />
          </LocalizationProvider>
          {category !== 0 && nearby[category] && (
            <Swiper slidesPerView={3} spaceBetween={30} pagination={{ clickable: true }} style={{ margin: "20px" }}>
              {nearby[category]?.map((place, index) => {
                const isExistingPlace = places.some((item) => item.place.name === place.name);
                if (!isExistingPlace) {
                  return (
                    <SwiperSlide key={index}>
                      <PlacesDetail from={trip.trip.from} to={trip.trip.to} date={date} place={place} tripId={tripId} />
                    </SwiperSlide>
                  );
                }
                return null;
              })}
            </Swiper>
          )}
          {loading && <Typography style={{ margin: "20px" }}>Loading...</Typography>}
          {!loading && category && !nearby[category] && <Typography style={{ margin: "20px" }}>No Places in this Category</Typography>}
          {!loading && !category && <Typography style={{ margin: "20px" }}>Please Select Category</Typography>}
        </>
      )}
    </Card>
  );
};

export default PlacesSlide;
