import { createBrowserRouter } from "react-router-dom";
import Home from "../views/home";
import Garden from "../views/Garden";
import Greenhouse from "../views/Greenhouse";
import Laboratory from "../views/Laboratory";
import Team from "../views/Team";
import Research from "../views/Research";
import Contact from "../views/Contact";
import SignIn from "../views/SignIn";
import SignUp from "../views/SignUp";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/garden",
    element: <Garden />,
  },
  {
    path: "/greenhouse",
    element: <Greenhouse />,
  },
  {
    path: "/laboratory",
    element: <Laboratory />,
  },
  {
    path: "/team",
    element: <Team />,
  },
  {
    path: "/research",
    element: <Research />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
]);

