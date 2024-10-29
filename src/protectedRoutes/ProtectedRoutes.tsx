import { Outlet, Navigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";

const ProtectedRoutes = () => {
  const { user } = useUserContext();

  if (user) {
    return <Outlet />;
  } else {
    <Navigate to="/signin" />;
  }
};

export default ProtectedRoutes;
