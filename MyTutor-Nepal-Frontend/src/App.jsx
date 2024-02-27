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
import Profile from "./pages/tutor/Profile";
import TutorHome from "./pages/tutor/Home";
import BookTutor from "./pages/BookTutor";
import MapPage from "./pages/Map";
import UserAppointments from "./pages/UserAppointments";
import TutorAppointments from "./pages/tutor/TutorAppointments";

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
                path="/map"
                element={
                  <ProtectedRoute>
                    <MapPage />
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
                path="/book-tutor/:tutorId"
                element={
                  <ProtectedRoute>
                    <BookTutor />
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
                path="/tutor"
                element={
                  <ProtectedRoute>
                    <TutorHome />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tutor/profile/:id"
                element={
                  <ProtectedRoute>
                    <Profile />
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
              <Route
                path="/student/appointments"
                element={
                  <ProtectedRoute>
                    <UserAppointments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tutor/appointments"
                element={
                  <ProtectedRoute>
                    <TutorAppointments />
                  </ProtectedRoute>
                }
              />
            </Routes>
          )}
        </Router>
      </ChakraProvider>
    </>
  );
}

export default App;
