import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import "swiper/css";
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { useSelector } from "react-redux";

const PlacesDetail = ({date , place, tripId }) => {
  const token = useSelector((state) => state.auth.token);

  const addPlace = async (place) => {
    const res = await fetch(`http://localhost:3001/addPlaces/${tripId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: place.name,
        date: date ,
        location: place.location,
      }),
    });
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
            addPlace(place);
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
  const tripId = trip._id;
  const [date, setDate] = React.useState(dayjs(trip.from));
  const [loading, setLoading] = React.useState(false);
  const [nearby, setNearby] = React.useState({});
  const [category, setCategory] = React.useState();
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
      `http://localhost:3001/nearby?x=${coordinates.x}&y=${coordinates.y}&categoryIds=${event.target.value}`,
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

  return (
    <Card>
      <FormControl fullWidth>
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
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker', 'DatePicker']}>
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
          {nearby[category].map((place, index) => (
            <SwiperSlide key={index}>
              <PlacesDetail date={date} place={place} tripId={tripId} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      {loading && <Typography>Loading...</Typography>}
      {!loading && category && !nearby[category] && (
        <Typography>No Places in this Category</Typography>
      )}
      {!loading && !category && <Typography>Please Select Category</Typography>}
    </Card>
  );
}
