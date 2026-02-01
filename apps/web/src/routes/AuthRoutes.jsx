import { Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import SetupPage from "../pages/SetupPage";

const AuthRoutes = [
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/setup",
    element: <SetupPage />,
  },
];

export default AuthRoutes;