import { configureStore } from "@reduxjs/toolkit";
import { alertSlice } from "./features/alertSlice";
import { userSlice } from "./features/userSlice";
import { appointmentSlice } from "./features/appointmentSlice";
import { ratingSlice } from "./features/ratingSlice";
import { notificationIdSlice } from "./features/notificationIdSlice";

export default configureStore({
  reducer: {
    alerts: alertSlice.reducer,
    user: userSlice.reducer,
    appointment: appointmentSlice.reducer,
    ratings: ratingSlice.reducer,
    notificationId: notificationIdSlice.reducer,
  },
});
