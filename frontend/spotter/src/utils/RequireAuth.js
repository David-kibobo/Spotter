import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Outlet } from "react-router-dom";

const RequireAuth = () => {
  const { user, status } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "succeeded" && user) {
        alert('this is the user', user)
      if (user.role === "Driver") {
        navigate("/dashboard/driver");
      } else {
        navigate("/dashboard"); // carrier/dispatcher
      }
    }
  }, [status, user, navigate]);

  return null; // or a spinner while redirecting
};

export default RequireAuth;
