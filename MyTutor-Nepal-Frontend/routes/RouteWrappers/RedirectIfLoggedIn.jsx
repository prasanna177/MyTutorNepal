import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const RedirectIfLoggedIn = ({ children }) => {
  let currentUserRole;
  if (localStorage.getItem("token")) {
    const decodedToken = jwtDecode(localStorage.getItem("token"));
    currentUserRole = decodedToken?.role;
  }
  if (localStorage.getItem("token")) {
    if (currentUserRole === "student") {
      return <Navigate to="/" />;
    } else if (currentUserRole === "admin") {
      return <Navigate to="/admin" />;
    } else if (currentUserRole === "tutor") {
      return <Navigate to="/tutor/students" />;
    }
  }
  return children;
};

export default RedirectIfLoggedIn;
