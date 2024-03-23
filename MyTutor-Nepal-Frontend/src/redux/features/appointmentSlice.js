import { createSlice } from "@reduxjs/toolkit";

export const appointmentSlice = createSlice({
  name: "appointment",
  initialState: {
    appointment: null,
  },
  reducers: {
    setAppointment: (state, action) => {
      state.appointment = action.payload;
    },
    removeAppointment: (state) => {
      state.appointment = null;
    },
  },
});

export const { setAppointment, removeAppointment } = appointmentSlice.actions;
