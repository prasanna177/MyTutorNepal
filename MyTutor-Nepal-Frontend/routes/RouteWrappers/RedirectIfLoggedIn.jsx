import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUser } from "../../src/redux/features/userSlice";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";

const RedirectIfLoggedIn = ({ children }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getUser = async () => {
    try {
      // dispatch(showLoading());
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_PORT}/api/user/getCurrentUser`,
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      // dispatch(hideLoading());
      if (response.data.success) {
        dispatch(setUser(response.data.data));
      } else {
        <Navigate to="/login" />;
      }
    } catch (error) {
      // dispatch(hideLoading());
      console.log(error);
    }
  };

  useEffect(() => {
    if (!user) {
      getUser();
    }
  }, [user, getUser]);

  if (localStorage.getItem("token")) {
    if (user?.role === "student") {
      return <Navigate to="/" />;
    } else if (user?.role === "admin") {
      return <Navigate to="/admin" />;
    } else if (user?.role === "tutor") {
      return <Navigate to="/tutor" />;
    }
  }
  return children;
};

export default RedirectIfLoggedIn;
