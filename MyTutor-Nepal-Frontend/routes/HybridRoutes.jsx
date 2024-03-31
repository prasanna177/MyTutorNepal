import AccessDenied from "../src/pages/AccessDenied";
import ChangePassword from "../src/pages/ChangePassword";

export const hybridRoutes = [
  {
    path: "/access-denied",
    element: <AccessDenied />,
    availability: ["student", "tutor", "admin"],
  },
  {
    path: "/change-password",
    element: <ChangePassword />,
    availability: ["student", "tutor"],
  },
];
