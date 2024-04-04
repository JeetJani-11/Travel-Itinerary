import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Card from "@mui/material/Card";
import { TextField } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Autocomplete from "@mui/material/Autocomplete";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import "swiper/css";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "swiper/css/pagination";
import { useDispatch } from "react-redux";
import { addPlace } from "../store/tripSlice";
import { Pagination } from "swiper/modules";
import { useSelector } from "react-redux";

const PlacesDetail = ({ date, place, tripId }) => {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const addPlacehandler = async (place) => {
    console.log(place);
    const res = await fetch(`/api/addPlaces/${tripId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: place.name,
        date: date,
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
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ marginBottom: 1 }}
        >
          Categories:
        </Typography>
        {place.categories.map((category, index) => (
          <Typography
            key={index}
            variant="body2"
            color="text.secondary"
            sx={{ display: "inline", marginRight: 1 }}
          >
            {category.label}
          </Typography>
        ))}
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

const Categories = [
  { label: "Landmarks and Outdoors", code: 16000 },
  { label: "Dining and Drinking", code: 13000 },
  { label: "Event", code: 14000 },
  { label: "Sports and Recreation", code: 18000 },
  { label: "Arts and Entertainment", code: 10000 },
  { label: "Travel and Transportation", code: 19000 },
  { label: "", code: 0 },
];

export default function PlacesSlide() {
  const trip = useSelector((state) => state.trip.trip);
  const token = useSelector((state) => state.auth.token);
  const coordinates = trip.coordinates;
  const places = trip.places;
  const tripId = trip._id;
  const [recommendation, setRecommendation] = useState([]);
  const [date, setDate] = React.useState(dayjs(trip.from));
  const [loading, setLoading] = React.useState(false);
  const [nearby, setNearby] = React.useState({});
  const [category, setCategory] = React.useState();
  let typingTimeout;
  const dispatch = useDispatch();
  const addPlacehandler = async () => {
    const res = await fetch(`/api/addPlaces/${tripId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: customPlaceName + " " + trip.destination,
        date: date,
        location: { x: -1, y: -1 },
      }),
    });
    const data = await res.json();
    if (res.ok) {
      dispatch(addPlace({ place: data, date }));
    }
    console.log(res);
  };
  console.log(date);
  const handleChange = async (event) => {
    setCategory(event.target.value);
    setLoading(true);
    const placeCode = event.target.value;
    if (nearby[event.target.value]) {
      setLoading(false);
      return;
    }
    const res = await fetch(
      `/api/nearby?x=${coordinates.x}&y=${coordinates.y}&categoryIds=${event.target.value}`,
      {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const nearbyJson = await res.json();
    const obj = {};
    obj[placeCode] = nearbyJson.places;
    setNearby({ ...nearby, ...obj });
    setLoading(false);
  };
  const handleTyping = (event) => {
    const { value } = event.target;
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(async () => {
      const res = await fetch(
        `/api/search/trips/${value}/${trip.destination}`,
        {
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setRecommendation(data);
      console.log(data);
    }, 500);
  };
  const [customPlace, setCustomPlace] = useState({ name: "" });
  const [customPlaceName , setCustomPlaceName] = useState('')
  const [isCustom, setIsCustom] = useState(false);
  console.log(customPlace);
  return (
    <Card
      sx={{
        margin: "10px",
        padding: "10px",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
      }}
    >
      <FormControlLabel
        control={<Switch checked={isCustom} onChange={() => setIsCustom(!isCustom)} />}
        label="Custom Place"
        sx={{ marginBottom: "10px" }}
      />

      {isCustom && (
        <>
          <Autocomplete
            id="controllable-states-demo"
            options={recommendation}
            value={customPlace}
            onChange={(event, newValue) => {
              if (newValue) {
                setCustomPlaceName(newValue.name);
              }
              setCustomPlace(newValue);
            }}
            getOptionLabel={(option) => option.name}
            sx={{ width: "300px", marginTop: "10px", marginLeft: "20px", marginBottom: "20px" }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Add Custom Place"
                onChange={(event) => {
                  handleTyping(event);
                  setCustomPlaceName(event.target.value);
                }}
                value={customPlaceName}
              />
            )}
          />

          <Button
            variant="contained"
            color="primary"
            sx={{ margin: "10px" }}
            onClick={addPlacehandler}
          >
            Add Custom Place
          </Button>
        </>
      )}
      {!isCustom && (
        <>
          <FormControl fullWidth sx={{ margin: "5px" }}>
            <InputLabel id="demo-simple-select-label">Category</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={category}
              displayEmpty={false}
              defaultValue={0}
              label="Category"
              onChange={handleChange}
            >
              {Categories.map((category, index) => (
                <MenuItem key={index} value={category.code}>
                  {category.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            sx={{ margin: "5px" }}
          >
            <DemoContainer components={["DatePicker", "DatePicker"]}>
              <DatePicker
                label="Controlled picker"
                value={date}
                onChange={(newValue) => setDate(newValue)}
              />
            </DemoContainer>
          </LocalizationProvider>
          {category !== 0 && nearby[category] && (
            <Swiper
              slidesPerView={3}
              spaceBetween={30}
              pagination={{ clickable: true }}
              modules={[Pagination]}
              sx={{ margin: "20px" }}
            >
              {nearby[category].map((place, index) => {
                console.log(places);
                const isExistingPlace = places.some(
                  (item) => item.place.name === place.name
                );
                console.log(isExistingPlace);
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
          )}
          {loading && <Typography>Loading...</Typography>}
          {!loading && category && !nearby[category] && (
            <Typography>No Places in this Category</Typography>
          )}
          {!loading && !category && (
            <Typography>Please Select Category</Typography>
          )}
        </>
      )}
    </Card>
  );
}
