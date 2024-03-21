import { createSlice } from "@reduxjs/toolkit";

export const ratingSlice = createSlice({
  name: "ratings",
  initialState: {
    ratingModal: false,
  },
  reducers: {
    showRatingModal: (state) => {
      state.ratingModal = true;
    },
    hideRatingModal: (state) => {
      state.ratingModal = false;
    },
  },
});

export const { showRatingModal, hideRatingModal } = ratingSlice.actions;
