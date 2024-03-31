import React, { useState } from "react";
import List from "@mui/material/List";
import { useSelector, useDispatch } from "react-redux";
import { removeNote } from "../store/tripSlice";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

export default function NotesList() {
  const trip = useSelector((state) => state.trip.trip);
  const token = useSelector((state) => state.auth.token);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const handleClick = () => {
    setOpen(!open);
  };
  const handleDeleteNote = async (note) => {
    const res = await fetch(`http://localhost:3001/removeNote/${trip._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
        body: JSON.stringify({
            text : note
        }),
    });
    if (res.ok) {
      alert("Place Deleted Successfully");
      dispatch(removeNote(note));
    }
  };
  console.log(trip.notes);
  return (
    <>
      <ListItemButton onClick={handleClick} sx={{ pl: 2 }}>
        <ListItemIcon>
          <DescriptionIcon />
        </ListItemIcon>
        <ListItemText primary='Notes' />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {trip.notes.length > 0 ? (
            trip.notes.map((note, noteIndex) => (
              <ListItemButton
                key={noteIndex}
                sx={{ pl: 4 }}
                onClick={() => {
                  handleDeleteNote(note);
                }}
              >
                <ListItemIcon>
                  <DeleteIcon />
                </ListItemIcon>
                <ListItemText primary={note} />
              </ListItemButton>
            ))
          ) : (
            <ListItemText primary="No notes added till now." />
          )}
        </List>
      </Collapse>
    </>
  );
}
