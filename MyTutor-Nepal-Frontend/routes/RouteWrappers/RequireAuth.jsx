import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../src/redux/features/alertSlice";
import { setUser } from "../../src/redux/features/userSlice";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

const RequireAuth = ({ children, userRoles }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getUser = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_PORT}/api/user/getCurrentUser`,
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        dispatch(setUser(response.data.data));
      } else {
        <Navigate to="/login" />;
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  useEffect(() => {
    if (!user) {
      getUser();
    }
    //eslint-disable-next-line
  }, [user, getUser]);

  let currentUserRole;
  if (localStorage.getItem("token")) {
    currentUserRole = user?.role;
  }
  console.log(currentUserRole, "crr");
  if (currentUserRole) {
    if (userRoles) {
      if (userRoles.includes(currentUserRole)) {
        return children;
      } else {
        return <Navigate to={"/access-denied"} />;
      }
    } else {
      return children;
    }
  } else {
    return <Navigate to="/login" />;
  }
};

export default RequireAuth;
