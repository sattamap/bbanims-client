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
import CoordinatorHome from "../pages/Dashboard/Coordinator/CoordinatorHome/CoordinatorHome";
import Equipment from "../pages/Dashboard/Common/Components/equipment";

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



      // common routes
   
      {
        path: "equipment",
        element: <Equipment></Equipment>,
      },


      // admin routes
   
      {
        path: "allUsers",
        element: <AllUsers></AllUsers>,
      },
     
      // coordinator routes
     
      {
        path: "coordinatorHome",
        element:<CoordinatorHome></CoordinatorHome>,
      },
      {
        path: "addItems",
        element:<AddItems></AddItems>,
      },
      
      {
        path: "manageItems",
        element:<ManageItems></ManageItems>,
      },
      {
        path: 'updateItem/:id',
        element:<UpdateItems></UpdateItems>,
        loader: ({params})=> fetch(`http://localhost:5000/item/${params.id}`)

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

