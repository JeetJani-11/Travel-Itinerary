import React from "react";
import Cookie from "js-cookie";
import { setUser } from "../store/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CheckAuth({ children }) {
  const [check, setCheck] = React.useState(false);
  const [Loading, setLoading] = React.useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  React.useEffect(() => {
    const tokenLocalStorage = localStorage.getItem("token");
    const tokenCookie = Cookie.get("token");
    console.log(tokenLocalStorage, tokenCookie);
    if (tokenLocalStorage && tokenCookie && tokenLocalStorage === tokenCookie) {
      setCheck(true);
    } else if ((tokenCookie && !tokenLocalStorage) || (tokenLocalStorage && tokenCookie && tokenLocalStorage !== tokenCookie)) {
      dispatch(setUser({ user: Cookie.get("user"), token: tokenCookie }));
      setCheck(true);
    } else {
      if (tokenLocalStorage) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
      if (tokenCookie) {
        Cookie.remove("token");
        Cookie.remove("user");
      }
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
