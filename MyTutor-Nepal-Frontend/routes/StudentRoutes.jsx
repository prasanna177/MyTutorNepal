import AccessDenied from "../src/pages/AccessDenied";
import BecomeTutor from "../src/pages/BecomeTutor";
import BookTutor from "../src/pages/BookTutor";
import Home from "../src/pages/Home";
import MapPage from "../src/pages/Map";
import UserAppointmentInfo from "../src/pages/UserAppointmentInfo";
import UserAppointments from "../src/pages/UserAppointments";

export const studentRoutes = [
  {
    path: "/",
    element: <Home />,
    availability: ["student"],
  },
  {
    path: "/map",
    element: <MapPage />,
    availability: ["student"],
  },
  {
    path: "/become-tutor",
    element: <BecomeTutor />,
    availability: ["student"],
  },
  {
    path: "/book-tutor/:tutorId",
    element: <BookTutor />,
    availability: ["student"],
  },
  {
    path: "/student/appointments",
    element: <UserAppointments />,
    availability: ["student"],
  },
  {
    path: "/student/appointments/:id",
    element: <UserAppointmentInfo />,
    availability: ["student"],
  },
  {
    path: "/access-denied",
    element: <AccessDenied />,
    availability: ["student", "tutor", "admin"],
  },
];
