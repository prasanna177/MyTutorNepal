import PayUsers from "../src/pages/admin/PayUsers";
import TutorInfo from "../src/pages/admin/TutorInfo";
import Tutors from "../src/pages/admin/Tutors";
import Users from "../src/pages/admin/Users";

export const adminRoutes = [
  {
    path: "/admin/users",
    element: <Users />,
    availability: ["admin"],
  },
  {
    path: "/admin/pay-users",
    element: <PayUsers />,
    availability: ["admin"],
  },
  {
    path: "/admin/tutors",
    element: <Tutors />,
    availability: ["admin"],
  },
  {
    path: "/admin/tutors/:tutorId",
    element: <TutorInfo />,
    availability: ["admin"],
  },
];
