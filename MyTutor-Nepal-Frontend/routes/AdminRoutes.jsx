import Admin from "../src/pages/admin/Admin";
import TutorInfo from "../src/pages/admin/TutorInfo";
import Tutors from "../src/pages/admin/Tutors";
import UserInfo from "../src/pages/admin/UserInfo";
import Users from "../src/pages/admin/Users";

export const adminRoutes = [
  {
    path: "/admin",
    element: <Admin />,
    availability: "admin",
  },
  {
    path: "/admin/users",
    element: <Users />,
    availability: "admin",
  },
  {
    path: "/admin/tutors",
    element: <Tutors />,
    availability: "admin",
  },
  {
    path: "/admin/tutors/:tutorId",
    element: <TutorInfo />,
    availability: "admin",
  },
  {
    path: "/admin/users/:userId",
    element: <UserInfo />,
    availability: "admin",
  },
];
