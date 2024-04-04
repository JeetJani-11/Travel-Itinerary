import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Button, Card } from "@mui/material";
import { useSelector } from "react-redux";

const AddFriend = () => {
  const trip = useSelector((state) => state.trip.trip);
  const tripId = trip.id;
  const token = useSelector((state) => state.auth.token);
  const [recommendation, setRecommendation] = useState([]);
  const [selectedName, setSelectedName] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  let typingTimeout;
 
  const handleSubmit = async () => {
    const includes = recommendation.find((name) => name.name === selectedName);
    if (selectedName && includes) {
      const res = await fetch(`/api/addUser/${tripId}`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user: selectedName,
        }),
      });
    } else {
      console.log("No name selected.");
    }
  };

  const handleTyping = (event) => {
    const { value } = event.target;
    
    setIsTyping(true);
    clearTimeout(typingTimeout);

    typingTimeout = setTimeout(async () => {

      const res = await fetch(`/api/users/${value}`, {
        headers: {
          "content-type": "application/json",
        },
      });
      const data = await res.json();
      setRecommendation(data);
      console.log(data);
      setIsTyping(false);
    }, 500);
  };
  console.log(selectedName , recommendation);
  return (
    <Card
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        marginTop: 20,
      }}
    >
      <Autocomplete
        disablePortal
        id="controllable-states-demo"
        options={recommendation}
        getOptionLabel={(option) => option.name}
        sx={{ width: "300px", marginTop: "10px", marginLeft: "20px", marginBottom: "20px" }}
        renderInput={(params) => (
          <TextField {...params} label="Add Friend" onChange={handleTyping} />
        )}
        onChange={(event, value) => setSelectedName(value ? value.name : "")}
      />
      <Button
        type="submit"
        onClick={handleSubmit}
        variant="contained"
        sx={{ margin: "10px" }}
      >
        Add Friend to Trip
      </Button>
    </Card>
  );
};

export default AddFriend;
