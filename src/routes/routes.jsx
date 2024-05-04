import {
  createBrowserRouter
} from "react-router-dom";
import Main from "../layout/Main";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Dashboard from "../layout/Dashboard";
import AllUsers from "../pages/Dashboard/Admin/AllUsers/AllUsers";
import AddItems from "../pages/Dashboard/Coordinator/AddItems/AddItems";
import Items from "../pages/Dashboard/Monitor/Items/Items";
import WelcomeMsg from "../pages/Dashboard/NoRole/WelcomeMsg.jsx/WelcomeMsg";
import ManageItems from "../pages/Dashboard/Coordinator/ManageItems/ManageItems";
import UpdateItems from "../pages/Dashboard/Coordinator/UpdateItems/UpdateItems";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    children:[
        {
            path:"/",
            element:<Login></Login>,
        },
        {
            path:"register",
            element:<Register></Register>,
        },
    ]
  },
  {
    path: "dashboard",
    element: <Dashboard></Dashboard>,
    children: [


      // admin routes
   
      {
        path: "allUsers",
        element: <AllUsers></AllUsers>,
      },
     
      // coordinator routes
     
      {
        path: "addItems",
        element:<AddItems></AddItems>,
      },
      
      {
        path: "manageItems",
        element:<ManageItems></ManageItems>,
      },
      {
        path: "updateItems",
        element:<UpdateItems></UpdateItems>,
      },
      
      // monitor routes
     
      {
        path: "items",
        element:<Items></Items>,
      },
       // user (no role) routes
       {
          path: "none",
          element: <WelcomeMsg></WelcomeMsg>,
        },
      

      
    ]
   
  }
]);

