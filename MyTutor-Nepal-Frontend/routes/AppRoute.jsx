import SpinnerComponenet from "../src/components/SpinnerComponent";
import { useSelector } from "react-redux";
import RatingModal from "../src/components/RatingModal";
import RedirectIfLoggedIn from "./RouteWrappers/RedirectIfLoggedIn";
import RequireAuth from "./RouteWrappers/RequireAuth";
import { adminRoutes } from "./AdminRoutes";
import { studentRoutes } from "./StudentRoutes";
import { tutorRoutes } from "./TutorRoutes";
import { authRoutes } from "./PublicRoutes";
import ErrorPage from "../src/components/ErrorPage";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const AppRoute = () => {
  const { loading } = useSelector((state) => state.alerts);
  const { ratingModal } = useSelector((state) => state.ratings);
  const protectedRoutes = [...adminRoutes, ...tutorRoutes, ...studentRoutes];

  const publicRoutes = [...authRoutes];
  console.log(protectedRoutes, "protected");
  console.log(publicRoutes, "public");
  return (
    <BrowserRouter>
      <ErrorBoundary FallbackComponent={ErrorPage}>
        {loading ? (
          <SpinnerComponenet />
        ) : (
          <Routes>
            {publicRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <RedirectIfLoggedIn>{route.element}</RedirectIfLoggedIn>
                }
              />
            ))}

            {protectedRoutes.map((route) => {
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <RequireAuth userRoles={route?.availability}>
                      {route.element}
                    </RequireAuth>
                  }
                />
              );
            })}
          </Routes>
        )}
        {ratingModal && <RatingModal ratingModal={ratingModal} />}
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default AppRoute;
