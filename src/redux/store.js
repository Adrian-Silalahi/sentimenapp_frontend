import { configureStore } from "@reduxjs/toolkit";
import dataProcessingReducer from "./dataSlice";
import tableDataReducer from "./tableSlice";
import stepProcessingReducer from "./stepslice";
import fineTuneSlice from "./fineTuneSlice";

export const store = configureStore({
  reducer: {
    dataProcessing: dataProcessingReducer,
    tableData: tableDataReducer,
    stepProcessing: stepProcessingReducer,
    fineTune: fineTuneSlice,
  },
});
