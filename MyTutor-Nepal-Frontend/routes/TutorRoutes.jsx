import AppointmentInfo from "../src/pages/tutor/AppointmentInfo";
import EditProfile from "../src/pages/tutor/EditProfile";
import TutorHome from "../src/pages/tutor/Home";
import Profile from "../src/pages/tutor/Profile";
import Students from "../src/pages/tutor/Students";
import TutorAppointments from "../src/pages/tutor/TutorAppointments";

export const tutorRoutes = [
  {
    path: "/tutor",
    element: <TutorHome />,
    availability: ["tutor"],
  },
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
];
