import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

import { useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";
export default function ApplicationBar() {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const dispatch = useDispatch()
  const handleLogout = async () => {
    const res = await fetch("/api/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (res.ok) {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("user");
      dispatch(logout())
      setOpen(false);
      navigate("/login");
    }
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            onClick={() => {
              navigate("/home");
            }}
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          >
            Travel Itinerary
          </Typography>
          {!user && (
            <Button
              color="inherit"
              onClick={() => {
                navigate("/login");
              }}
            >
              Login
            </Button>
          )}
          {!user && (
            <Button
              color="inherit"
              onClick={() => {
                navigate("/signup");
              }}
            >
              SignUp
            </Button>
          )}
          {user && (
            <>
              <Button color="inherit" onClick={handleClickOpen}>
                Logout
              </Button>
              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Are you sure you want to logout?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>No</Button>
                  <Button onClick={handleLogout} autoFocus>
                    Yes
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
