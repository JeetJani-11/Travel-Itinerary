import { useSelector, useDispatch } from "react-redux";
import { setTrips } from "../store/tripsSlice";
import AddTrip from "../components/AddTrip";
import { useEffect } from "react";
import TripsList from "../components/TripsList";
import { Card } from "@mui/material";

export default function Home() {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  console.log(token);
  const getTrips = async () => {
    const response = await fetch("/api/trips", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    dispatch(setTrips(data));
    console.log(data);
  };
  useEffect(() => {
    getTrips();
  }, [token]);
  return (
    <Card sx={{ 
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        backgroundColor: '#FFFFFF',
        
      }}>
        <AddTrip />
        <TripsList />
      </Card>
      
  );
}
