import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const RequireAuth = ({ children, requiredRoles = [] }) => {
  const { user, status } = useSelector((state) => state.auth);
  const location = useLocation();

  if (status === "loading" || status === "idle") {
    return null; 
  }

  if (!user) {
    // Not logged in → redirect to landing
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (requiredRoles.length && !requiredRoles.includes(user.role)) {
    // Logged in but role not allowed 
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireAuth;
