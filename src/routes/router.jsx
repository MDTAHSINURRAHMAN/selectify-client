import { createBrowserRouter } from "react-router-dom";
import Navbar from "../components/shared/Navbar";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Queries from "../pages/Queries";
import Recommendations from "../pages/Recommendations";
import MyQueries from "../pages/MyQueries";
import MyRecommendations from "../pages/MyRecommendations";
import PrivateRoute from "./PrivateRoute";
import AddQuery from "../pages/AddQuery";
import QueryDetails from "../pages/QueryDetails";
import UpdateQueryPage from "../pages/UpdateQueryPage";
import Home from "../pages/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home></Home>,
  },
  {
    path: "/queries",
    element: <Queries></Queries>,
  },
  {
    path: "/add-query",
    element: <AddQuery></AddQuery>,
  },
  {
    path: "/update-query/:id",
    element: <UpdateQueryPage></UpdateQueryPage>,
  },
  {
    path: "/query/:id",
    element: (
      <PrivateRoute>
        <QueryDetails></QueryDetails>
      </PrivateRoute>
    ),
  },
  {
    path: "/recommendations",
    element: <Recommendations></Recommendations>,
  },
  {
    path: "/my-queries",
    element: (
      <PrivateRoute>
        <MyQueries></MyQueries>
      </PrivateRoute>
    ),
  },
  {
    path: "/my-recommendations",
    element: (
      <PrivateRoute>
        <MyRecommendations></MyRecommendations>
      </PrivateRoute>
    ),
  },
  {
    path: "/auth/login",
    element: <Login></Login>,
  },
  {
    path: "/auth/register",
    element: <Register></Register>,
  },
]);

export default router;
