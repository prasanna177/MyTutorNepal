import { Navigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import { setUser } from "../redux/features/userSlice";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
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
  }, [user, getUser]);


  if (localStorage.getItem("token")) {
    return children;
  }

  return <Navigate to="/login" />;
};

export default ProtectedRoute;
