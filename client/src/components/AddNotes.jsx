import { Button, Card } from "@mui/material";
import { useSelector , useDispatch } from "react-redux";
import { addNote } from "../store/tripSlice";

export default function AddNotes() {
    const trip = useSelector((state) => state.trip.trip);
    const token = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();
    const handleClick = async() => {
        const text = document.getElementById("note").value;
        const res = await fetch(`http://localhost:3001/addNotes/${trip.id}`, {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json' ,
                Authorization : `Bearer ${token}` 
            },
            body : JSON.stringify({
                text 
            })
        });
        if(res.ok){
            dispatch(addNote({
                text
            }));
            alert('Note Added Successfully');

        }
        console.log(res);
        
    };
  return (
    <Card
      sx={{
        margin: "10px",
        padding: "10px",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        display : 'flex' ,
        flexDirection : 'column'
      }}
    >
      <textarea id="note" cols="30" rows="10"></textarea>
      <Button onClick={handleClick}>Add Note</Button>
    </Card>
  );
}
