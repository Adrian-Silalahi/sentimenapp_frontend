import {
  requestCleanHtml,
  requestCleanText,
  requestVaderSentiment,
  requestBalancingData,
} from "../api/preprocess";
import {
  setDownloadFileNames, // Ditambahkan kembali
  setBalanceData,
  setPrepo1Data,
  setPrepo2Data,
  setVaderLabelData,
} from "../redux/dataSlice";
import { getTexts2D } from "./getText2D";

export const SimulationProcessingData = async ({
  activeStep,
  dispatch,
  raw_data,
  prepo_1,
  prepo_2,
  vader_label,
  data_balance,
  download_file_names,
}) => {
  const indexStep = activeStep - 1;
  // Konfigurasi untuk setiap langkah simulasi
  const stepConfig = {
    1: {
      shouldProcess: () => prepo_1.length === 0,
      getInput: () => getTexts2D(raw_data?.tableData),
      apiRequest: requestCleanHtml,
      dataExtractor: (res) => res.data.cleaned_html,
      dispatchAction: setPrepo1Data,
    },
    2: {
      shouldProcess: () => prepo_2.length === 0,
      getInput: () => getTexts2D(prepo_1),
      apiRequest: requestCleanText,
      dataExtractor: (res) => res.data.normalized_text,
      dispatchAction: setPrepo2Data,
    },
    3: {
      shouldProcess: () => vader_label.length === 0,
      getInput: () => getTexts2D(prepo_2),
      apiRequest: requestVaderSentiment,
      dataExtractor: (res) => res.data.sentiment_results.map((item) => item[1]),
      dispatchAction: setVaderLabelData,
    },
    4: {
      shouldProcess: () => data_balance.length === 0,
      // Logika khusus untuk menggabungkan data input
      getInput: () => prepo_2.map((item, idx) => [item[0], vader_label[idx]]),
      apiRequest: requestBalancingData,
      dataExtractor: (res) => res.data.balanced_data,
      dispatchAction: setBalanceData,
    },
  };

  const currentStep = stepConfig[activeStep];

  // Keluar jika tidak ada konfigurasi untuk step ini atau jika data sudah ada
  if (!currentStep || !currentStep.shouldProcess()) {
    return;
  }

  try {
    const inputData = currentStep.getInput();
    const response = await currentStep.apiRequest(inputData);
    const processedData = currentStep.dataExtractor(response);

    dispatch(currentStep.dispatchAction(processedData));

    if (response.data.download_file_name) {
      const new_download_file_names = { ...download_file_names };
      new_download_file_names[indexStep] = response.data.download_file_name;
      dispatch(setDownloadFileNames(new_download_file_names));
    }
  } catch (error) {
    console.error(
      `Error processing data for simulation step ${activeStep}:`,
      error
    );
  }
};
