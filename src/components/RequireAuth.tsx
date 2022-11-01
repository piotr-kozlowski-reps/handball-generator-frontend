import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

interface Props {
  allowedRoles: number[];
}
const RequireAuth = ({ allowedRoles }: Props) => {
  ////vars
  const { auth } = useAuth();
  const location = useLocation();

  ////jsx
  return auth?.roles?.find((role) => allowedRoles?.includes(role)) ? (
    <Outlet />
  ) : auth?.accessToken ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
