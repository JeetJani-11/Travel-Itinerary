import React from "react";

import { setUser } from "../store/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CheckAuth({ children }) {
  const [check, setCheck] = React.useState(false);
  const [Loading, setLoading] = React.useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log("CheckAuth" , window.localStorage.getItem("token") , window.localStorage.getItem("user"));
  React.useEffect(() => {
    const tokenLocalStorage = localStorage.getItem("token");
    if (tokenLocalStorage) {
      dispatch(setUser({ user: localStorage.getItem('user'), token: tokenLocalStorage}));
      setCheck(true);
    } else {
      setCheck(false);
    }

    setLoading(false);
  }, []);
  return Loading ? (
    <div>Loading...</div>
  ) : check ? (
    <>{children}</>
  ) : (
    navigate("/login")
  );
}
