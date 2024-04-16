import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../src/redux/features/alertSlice";
import { setUser } from "../../src/redux/features/userSlice";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const RequireAuth = ({ children, userRoles }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const clearLocalStorageOnError = (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
    }
  };

  // Setup Axios interceptors
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        clearLocalStorageOnError(error);
        return Promise.reject(error);
      }
    );

    return () => {
      // Cleanup interceptor on component unmount
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

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
    const decodedToken = jwtDecode(localStorage.getItem("token"));
    currentUserRole = decodedToken?.role;
  }
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
  }
  //causing issue when reloading because global state is initially empty
  else {
    return <Navigate to="/login" />;
  }
};

export default RequireAuth;
