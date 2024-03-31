import React, { useState } from "react";
import List from "@mui/material/List";
import dayjs from "dayjs";
import { useSelector , useDispatch } from "react-redux";
import { removePlace } from "../store/tripSlice";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

export default function PlacesList() {
    const places = useSelector((state) => state.trip.trip.itinerary);
    const trip = useSelector((state) => state.trip.trip);
    const token = useSelector((state) => state.auth.token);
    console.log(places);
 function iterateDates(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dates = [];
    while (start <= end) {
      dates.push(new Date(start));
      start.setDate(start.getDate() + 1);
    }
    return dates;
 }

 const dates = iterateDates(trip.from, trip.to);
 const [dateStates, setDateStates] = useState(
    dates.map(() => ({ open: false }))
 );
 const dispatch = useDispatch();
 const formatDate = (date) => {
    return dayjs(date).format("DD MMM");
 };
 const handleClick = (index) => {
    setDateStates(
      dateStates.map((state, i) =>
        i === index ? { open: !state.open } : state
      )
    );
 };
const handleDeletePlace =  async (place) => {
    const res = await fetch(`http://localhost:3001/removePlace/${place._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    });
    if (res.ok) {
      alert("Place Deleted Successfully");
      dispatch(removePlace(place._id));
    }
}
 const placesByDate = dates.map((date) => ({
    date,
    places: places.filter((place) => {
      const placeDate = new Date(place.date);
      return (
        placeDate.getFullYear() === date.getFullYear() &&
        placeDate.getMonth() === date.getMonth() &&
        placeDate.getDate() === date.getDate()
      );
    }),
 }));

 return (
    <>
      {placesByDate.map(({ date, places }, index) => (
        <List
          key={index}
          sx={{ width: "100%", bgcolor: "background.paper" }}
          component="nav"
          aria-labelledby="nested-list-subheader"
        >
          <ListItemButton onClick={() => handleClick(index)} sx={{ pl: 2 }}>
            <ListItemIcon>
              <CalendarMonthIcon />
            </ListItemIcon>
            <ListItemText primary={formatDate(date)} />
            {dateStates[index].open ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={dateStates[index].open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {places.length > 0 ? (
                places.map((place, placeIndex) => (
                 <ListItemButton
                    key={placeIndex}
                    sx={{ pl: 4 }}
                    onClick={()=>{handleDeletePlace(place)}}
                 >
                    <ListItemIcon>
                      <DeleteIcon />
                    </ListItemIcon>
                    <ListItemText primary={place.name} />
                 </ListItemButton>
                ))
              ) : (
                <ListItemText primary="No places allocated for this date." />
              )}
            </List>
          </Collapse>
        </List>
      ))}
    </>
 );
}
