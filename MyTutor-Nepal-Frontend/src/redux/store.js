import { configureStore } from "@reduxjs/toolkit";
import { alertSlice } from "./features/alertSlice";
import { userSlice } from "./features/userSlice";
import { tutorSlice } from "./features/tutorSlice";
import { ratingSlice } from "./features/ratingSlice";
import { notificationIdSlice } from "./features/notificationIdSlice";

export default configureStore({
  reducer: {
    alerts: alertSlice.reducer,
    user: userSlice.reducer,
    tutor: tutorSlice.reducer,
    ratings: ratingSlice.reducer,
    notificationId: notificationIdSlice.reducer,
  },
});
