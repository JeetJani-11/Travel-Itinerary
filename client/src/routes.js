import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Trip from "./pages/Trip";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import CheckAuth from "./utils/CheckAuth";
import CheckGeust from "./utils/CheckGeust";
import Home from "./pages/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/home",
        element: (
          <CheckAuth>
            <Home />
          </CheckAuth>
        ),
      },
      {
        path: "/login",
        element: (
          <CheckGeust>
            <Login />
          </CheckGeust>
        ),
      },
      {
        path: "/signup",
        element: (
          <CheckGeust>
            <SignUp />
          </CheckGeust>
        ),
      },
      {
        path: "/trip",
        element: (
          <CheckAuth>
            <Trip />
          </CheckAuth>
        ),
      }
    ],
  },
]);

export default router;
