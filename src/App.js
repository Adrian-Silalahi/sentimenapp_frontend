import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./page/dashboard/dashboard";
import FormAnalyze from "./page/form_analyze/form_analyze";
import DataAnalyze from "./page/data_analyze/dataAnalyze";
import "./App.scss";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import DataExtraction from "./page/data_extraction/data_extraction";
import { Toaster } from "react-hot-toast";
import HtmlCleansing from "./page/textPreprocessing/htmlCleansing/HtmlCleansing";
import NormalizeText from "./page/textPreprocessing/normalizeText/NormalizeText";
import VaderLabeling from "./page/textPreprocessing/vaderLabeling/VaderLabeling";
import DataBalancing from "./page/textPreprocessing/dataBalancing/DataBalancing";
import RobertaBuilder from "./page/robertaBuilder/robertaBuilder";
import LandingPage from "./page/landing_page/LandingPage";
import DashboardLayout from "./components/layout/DashboardLayout";

function AppContent() {
  return (
    <>
      <div className="app-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          {/* Protected Dashboard Routes with Shared Layout */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/data-extraction" element={<DataExtraction />} />
            <Route path="/html-element-cleansing" element={<HtmlCleansing />} />
            <Route path="/normalize-text" element={<NormalizeText />} />
            <Route path="/vader-labeling" element={<VaderLabeling />} />
            <Route path="/data-balancing" element={<DataBalancing />} />
            <Route path="/single-text-analysis" element={<FormAnalyze />} />
            <Route path="/file-based-analysis" element={<DataAnalyze />} />
            <Route
              path="/roberta-builder-simulator"
              element={<RobertaBuilder />}
            />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Toaster />
      </div>
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;
