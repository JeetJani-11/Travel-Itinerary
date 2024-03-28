import {
    createBrowserRouter,
  } from "react-router-dom";
import App from "./App";

  const router = createBrowserRouter([
    {
      path: "/",
      element: <App/>,
      children: [
        {
          path: "/",
          element: <>Home</>,
        },
        {
          path: "/about",
          element: <>About </>,
        },
        {
          path: "/contact",
          element: <>Contact </>,
        }
      ]
    },
  ]);

  export default router ;