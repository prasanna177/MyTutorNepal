import { ChakraProvider } from "@chakra-ui/react";
import Login from "./pages/Login";
import { theme } from "./theme";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import SpinnerComponenet from "./components/SpinnerComponent";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import BecomeTutor from "./pages/BecomeTutor";
import Admin from "./pages/admin/Admin";
import Users from "./pages/admin/Users";
import Tutors from "./pages/admin/Tutors";

function App() {
  const { loading } = useSelector((state) => state.alerts);
  return (
    <>
      <ChakraProvider theme={theme}>
        <Toaster position="top-center" reverseOrder={false} />
        <Router>
          {loading ? (
            <SpinnerComponenet />
          ) : (
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute>
                    <Users />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/tutors"
                element={
                  <ProtectedRoute>
                    <Tutors />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/become-tutor"
                element={
                  <ProtectedRoute>
                    <BecomeTutor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/signup"
                element={
                  <PublicRoute>
                    <Signup />
                  </PublicRoute>
                }
              />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Routes>
          )}
        </Router>
      </ChakraProvider>
    </>
  );
}

export default App;
