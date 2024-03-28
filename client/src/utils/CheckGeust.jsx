import React from "react";
import Cookie from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function CheckGeust({ children }) {
  const [check, setCheck] = React.useState(false);
  const [Loading, setLoading] = React.useState(true);
  const navigate = useNavigate();
  React.useEffect(() => {
    const tokenLocalStorage = localStorage.getItem("token");
    const tokenCookie = Cookie.get("token");
    if (tokenLocalStorage && tokenCookie && tokenLocalStorage === tokenCookie) {
      setCheck(false);
    }else {
      setCheck(true);
    }
    setLoading(false);
  }, []);
  return Loading ? (
    <div>Loading...</div>
  ) : check ? (
    <>{children}</>
  ) : (
    navigate("/home")
  );
}
