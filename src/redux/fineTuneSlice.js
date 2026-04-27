import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: "idle",
  jobId: null,
  progressMessage: "",
  errorMessage: "",
};

export const fineTuneSlice = createSlice({
  name: "fineTune",
  initialState,
  reducers: {
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setProgressMessage: (state, action) => {
      state.progressMessage = action.payload;
    },
    setErrorMessage: (state, action) => {
      state.errorMessage = action.payload;
    },
    setJobId: (state, action) => {
      state.jobId = action.payload;
    },
    resetFineTune: (state) => {
      state.status = "idle";
      state.jobId = null;
      state.progressMessage = "";
      state.errorMessage = "";
    },
  },
});

// Ekspor actions
export const {
  setStatus,
  setProgressMessage,
  setErrorMessage,
  setJobId,
  resetFineTune,
} = fineTuneSlice.actions;

// Ekspor reducer
export default fineTuneSlice.reducer;
