import {
  createBrowserRouter
} from "react-router-dom";
import "./index.css";
import Main from "../layout/Main";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    children:[
        {
            path:"/",
        }
    ]
  },
]);

