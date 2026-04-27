import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  table_headers: [],
  table_body: [],
  table_label: [],
};

export const tableSlice = createSlice({
  name: "tableData",
  initialState,
  reducers: {
    setTableHeaders: (state, action) => {
      state.table_headers = action.payload;
    },
    setTableBody: (state, action) => {
      state.table_body = action.payload;
    },
    setTableLabel: (state, action) => {
      state.table_label = action.payload;
    },
    resetTableData: (state) => {
      state.table_headers = [];
      state.table_body = [];
      state.table_label = [];
    },
  },
});

// Ekspor actions
export const { setTableBody, setTableHeaders, setTableLabel, resetTableData } =
  tableSlice.actions;

// Ekspor reducer
export default tableSlice.reducer;
