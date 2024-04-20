import BecomeTutor from "../src/pages/BecomeTutor";
import BookTutor from "../src/pages/BookTutor";
import Home from "../src/pages/Home";
import MapPage from "../src/pages/Map";
import MyAssignments from "../src/pages/MyAssignments";
import MyTutors from "../src/pages/MyTutors";
import PaymentSuccess from "../src/pages/PaymentSuccess";
import UserAppointmentInfo from "../src/pages/UserAppointmentInfo";
import UserAppointments from "../src/pages/UserAppointments";
import UserProfile from "../src/pages/UserProfile";

export const studentRoutes = [
  {
    path: "/home",
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
    path: "/student/profile/:id",
    element: <UserProfile />,
    availability: ["student"],
  },
  {
    path: "/student/assignments",
    element: <MyAssignments />,
    availability: ["student"],
  },
  {
    path: "/student/mytutors",
    element: <MyTutors />,
    availability: ["student"],
  },
  {
    path: "/payment-success/:bookingId",
    element: <PaymentSuccess />,
    availability: ["student"],
  },
];
