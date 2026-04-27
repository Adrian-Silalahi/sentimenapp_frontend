import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  info_file: { name: "", size: "" },
  raw_data: [],
  prepo_1: [], // Hasil cleaning HTML
  prepo_2: [], // Hasil cleaning noise (URL, @, #, angka, ALL CAPS, tanda baca)
  vader_label: [], // Label sentimen (negative, neutral, positive)
  data_balance: [], // Data balance
  roberta: [], // Hasil analisis RoBERTa { analyzeResult: "", confidence: "" }
  download_file_names: {},
};

export const dataSlice = createSlice({
  name: "dataProcessing",
  initialState,
  reducers: {
    setInfoFile: (state, action) => {
      state.info_file = action.payload;
    },
    setRawData: (state, action) => {
      state.raw_data = action.payload;
    },
    // Actions untuk mengisi data setelah "API call" berhasil
    setPrepo1Data: (state, action) => {
      state.prepo_1 = action.payload;
    },
    setPrepo2Data: (state, action) => {
      state.prepo_2 = action.payload;
    },
    setVaderLabelData: (state, action) => {
      state.vader_label = action.payload;
    },
    setBalanceData: (state, action) => {
      state.data_balance = action.payload;
    },
    setRobertaData: (state, action) => {
      state.roberta = action.payload;
    },
    setDownloadFileNames: (state, action) => {
      state.download_file_names = action.payload;
    },
    // Action untuk mereset state ke kondisi awal (kecuali raw_data)
    resetProcessedData: (state) => {
      state.info_file = { name: "", size: "" };
      state.raw_data = [];
      state.prepo_1 = [];
      state.prepo_2 = [];
      state.vader_label = [];
      state.data_balance = [];
      state.roberta = [];
    },
  },
});

// Ekspor actions
export const {
  setDownloadFileNames,
  setInfoFile,
  setRawData,
  setPrepo1Data,
  setPrepo2Data,
  setVaderLabelData,
  setBalanceData,
  setRobertaData,
  resetProcessedData,
} = dataSlice.actions;

// Ekspor reducer
export default dataSlice.reducer;
