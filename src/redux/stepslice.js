import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  completedList: {},
  activeStep: 0,
};

export const stepSlice = createSlice({
  name: "stepProcessing",
  initialState,
  reducers: {
    setActiveStep: (state, action) => {
      state.activeStep = action.payload;
    },
    setCompletedList: (state, action) => {
      state.completedList = action.payload;
    },
    resetCompletedList: (state) => {
      state.completedList = {};
    },
  },
});

// Ekspor actions
export const { setCompletedList, resetCompletedList, setActiveStep } =
  stepSlice.actions;

// Ekspor reducer
export default stepSlice.reducer;
