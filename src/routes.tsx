import { createBrowserRouter } from "react-router-dom";
import Hero from "./pages/Hero";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import ProtectedRoutes from "./protectedRoutes/ProtectedRoutes";
import Error from "./pages/Error";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Hero />,
    errorElement: <Error />,
  },
  {
    path: "/signin",
    element: <SignIn />,
    errorElement: <Error />,
  },
  {
    path: "/signup",
    element: <SignUp />,
    errorElement: <Error />,
  },
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
        errorElement: <Error />,
      },
      {
        path: "/contact",
        element: <Contact />,
        errorElement: <Error />,
      },
      {
        path: "/profile",
        element: <Profile />,
        errorElement: <Error />,
      },
    ],
  },
]);

export default router;
