import AppointmentInfo from "../src/pages/tutor/AppointmentInfo";
import AssignmentHistory from "../src/pages/tutor/AssignmentHistory";
import EditProfile from "../src/pages/tutor/EditProfile";
import Profile from "../src/pages/tutor/Profile";
import Students from "../src/pages/tutor/Students";
import TutorAppointments from "../src/pages/tutor/TutorAppointments";
import TutorPayment from "../src/pages/tutor/TutorPayment";

export const tutorRoutes = [
  {
    path: "/tutor/students",
    element: <Students />,
    availability: ["tutor"],
  },
  {
    path: "/tutor/profile/:id",
    element: <Profile />,
    availability: ["tutor"],
  },
  {
    path: "/tutor/edit-profile/:id",
    element: <EditProfile />,
    availability: ["tutor"],
  },
  {
    path: "/tutor/appointments",
    element: <TutorAppointments />,
    availability: ["tutor"],
  },
  {
    path: "/tutor/appointments/:appointmentId",
    element: <AppointmentInfo />,
    availability: ["tutor"],
  },
  {
    path: "/tutor/appointments/assignments/:appointmentId",
    element: <AssignmentHistory />,
    availability: ["tutor"],
  },
  {
    path: "/tutor/payment",
    element: <TutorPayment />,
    availability: ["tutor"],
  },
];
