import { createSlice } from "@reduxjs/toolkit";

export const notificationIdSlice = createSlice({
  name: "notificationId",
  initialState: {
    notificationId: null,
  },
  reducers: {
    setNotification: (state, action) => {
      state.notificationId = action.payload;
    },
    removeNotification: (state) => {
      state.notificationId = null;
    },
  },
});

export const { setNotification, removeNotification } = notificationIdSlice.actions;
