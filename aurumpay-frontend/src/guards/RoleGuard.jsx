import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

const RoleGuard = ({ role, children }) => {
  const { user } = useAuth();

  if (!user || user.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RoleGuard;
