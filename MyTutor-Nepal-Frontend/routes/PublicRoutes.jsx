import EmailVerify from "../src/pages/EmailVerify";
import ForgotPassword from "../src/pages/ForgotPassword";
import Login from "../src/pages/Login";
import ResetPassword from "../src/pages/ResetPassword";
import Signup from "../src/pages/Signup";

export const authRoutes = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "users/:id/verify/:token",
    element: <EmailVerify />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password/:id/:token",
    element: <ResetPassword />,
  },

];
