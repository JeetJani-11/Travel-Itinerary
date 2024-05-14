import React from "react";
import { setUser } from "../store/authSlice";
import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";

export default function CheckAuth({ children }) {
  const dispatch = useDispatch();
  const tokenLocalStorage = localStorage.getItem("token");
  const userLocalStorage = localStorage.getItem("user");
  if (!tokenLocalStorage) {
    dispatch(setUser({ user: null, token: null }));
    return <Navigate to="/login" replace />;
  } else {
    dispatch(setUser({ user: userLocalStorage, token: tokenLocalStorage }));
    return <>{children}</>;
  }
}
