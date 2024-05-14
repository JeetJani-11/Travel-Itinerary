import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../store/authSlice";
import { Navigate } from "react-router-dom";

export default function CheckGeust({ children }) {
  const dispatch = useDispatch();
  const tokenLocalStorage = localStorage.getItem("token");
  const userLocalStorage = localStorage.getItem("user");
  if (tokenLocalStorage) {
    console.log("CheckGuest");
    dispatch(setUser({ user: userLocalStorage, token: tokenLocalStorage }));
    return <Navigate to="/home" replace />;
  } else {
    dispatch(setUser({ user: null, token: null }));
    return <>{children}</>;
  }
}
