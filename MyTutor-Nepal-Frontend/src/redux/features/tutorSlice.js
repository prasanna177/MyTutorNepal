import { createSlice } from "@reduxjs/toolkit";

export const tutorSlice = createSlice({
  name: "tutor",
  initialState: {
    tutor: null,
  },
  reducers: {
    setTutor: (state, action) => {
      state.tutor = action.payload;
    },
    removeTutor: (state) => {
      state.tutor = null;
    },
  },
});

export const { setTutor, removeTutor } = tutorSlice.actions;
