import {
  requestCleanHtml,
  requestCleanText,
  requestVaderSentiment,
  requestRobertaPredict,
} from "../api/preprocess";
import {
  setDownloadFileNames,
  setPrepo1Data,
  setPrepo2Data,
  setRobertaData,
  setVaderLabelData,
} from "../redux/dataSlice";
import { getTexts2D } from "./getText2D";

export const FileProcessingData = async ({
  activeStep,
  dispatch,
  raw_data,
  prepo_1,
  prepo_2,
  vader_label,
  roberta,
  download_file_names,
}) => {
  const indexStep = activeStep - 1;
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
      shouldProcess: () => roberta.length === 0,
      getInput: () => getTexts2D(prepo_2),
      apiRequest: requestRobertaPredict,
      dataExtractor: (res) => res.data.predictions,
      dispatchAction: setRobertaData,
    },
  };

  const currentStep = stepConfig[activeStep];

  if (!currentStep || !currentStep.shouldProcess()) {
    return;
  }

  try {
    const texts = currentStep.getInput();
    const response = await currentStep.apiRequest(texts);
    const processedData = currentStep.dataExtractor(response);

    // Dispatch data utama dan nama file download
    dispatch(currentStep.dispatchAction(processedData));
    const new_download_file_names = { ...download_file_names };
    new_download_file_names[indexStep] = response.data.download_file_name;
    dispatch(setDownloadFileNames(new_download_file_names));
  } catch (error) {
    console.error(`Error processing data for step ${activeStep}:`, error);
  }
};
