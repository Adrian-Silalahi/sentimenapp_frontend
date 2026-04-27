import React, { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import {
  FiCpu,
  FiCheckCircle,
  FiDownload,
  FiXCircle,
  FiPlayCircle,
  FiInfo,
} from "react-icons/fi";
import "react-toastify/dist/ReactToastify.css";
import "./fineTunePaper.scss";
import { Paper } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setCompletedList } from "../../../../redux/stepslice";
import {
  setStatus,
  setJobId,
  setErrorMessage,
  setProgressMessage,
  resetFineTune,
} from "../../../../redux/fineTuneSlice";

// ─── Simulation helpers ───────────────────────────────────────────────────────

/** Generate a plausible loss curve: starts ~0.65, decreases per epoch */
const simulateLoss = (epoch, totalEpochs, seed = 1) => {
  const base = 0.65 - (epoch / totalEpochs) * 0.55;
  const noise = (Math.sin(epoch * seed * 7.3) * 0.02);
  return Math.max(0.05, base + noise).toFixed(4);
};

const simulateAccuracy = (epoch, totalEpochs) => {
  const base = 0.60 + (epoch / totalEpochs) * 0.38;
  return Math.min(0.99, base).toFixed(4);
};

// Pre-built demo model hosted on GitHub Releases (replace with your own URL)
const DEMO_MODEL_URL =
  "https://github.com/placeholder/sentimen-ai/releases/download/v1.0/roberta_sentiment_model.zip";

// ─── Component ────────────────────────────────────────────────────────────────

const FineTunePaper = () => {
  const { data_balance: trainingData } = useSelector(
    (state) => state.dataProcessing,
  );
  const { completedList } = useSelector((state) => state.stepProcessing);
  const { status, jobId, errorMessage } = useSelector(
    (state) => state.fineTune,
  );

  const dispatch = useDispatch();
  const intervalRef = useRef(null);

  const apiUrl = "https://4c869fa4155a.ngrok-free.app";

  const [params, setParams] = useState({
    learning_rate: "2e-5",
    num_epochs: "3",
    batch_size: "8",
    weight_decay: "0.01",
  });

  // Simulation-specific state
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [simProgress, setSimProgress] = useState({
    currentEpoch: 0,
    totalEpochs: 3,
    step: 0,
    totalSteps: 100,
    loss: "—",
    accuracy: "—",
    phase: "idle", // idle | preparing | training | done
    phaseLabel: "",
  });

  const apiClient = useMemo(() => {
    return axios.create({
      baseURL: apiUrl,
      headers: { "ngrok-skip-browser-warning": "true" },
    });
  }, [apiUrl]);

  const convertArrayToCSV = (data) => {
    const header = "message,label\n";
    const rows = data
      .map((row) => {
        const message = `"${row[0].replace(/"/g, '""')}"`;
        let labelValue;
        switch (row[1].toLowerCase()) {
          case "positive": labelValue = 2; break;
          case "neutral":  labelValue = 1; break;
          case "negative": labelValue = 0; break;
          default:         labelValue = row[1];
        }
        return `${message},${labelValue}`;
      })
      .join("\n");
    return header + rows;
  };

  const handleParamChange = (e) => {
    const { name, value } = e.target;
    setParams((prev) => ({ ...prev, [name]: value }));
  };

  // ── Real training (ngrok live) ──────────────────────────────────────────────
  const handleRealTraining = async () => {
    dispatch(setProgressMessage("Preparing data for training..."));
    toast.info("Training request sent!");

    try {
      const csvData = convertArrayToCSV(trainingData);
      const blob = new Blob([csvData], { type: "text/csv" });
      const formData = new FormData();
      formData.append("dataset", blob, "training_data.csv");
      formData.append("learning_rate", params.learning_rate);
      formData.append("num_epochs", params.num_epochs);
      formData.append("batch_size", params.batch_size);
      formData.append("weight_decay", params.weight_decay);

      const response = await apiClient.post(`${apiUrl}/train`, formData);
      dispatch(setJobId(response.data.job_id));
      dispatch(setStatus("training"));
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || "Failed to connect to training server.";
      dispatch(setErrorMessage(errorMsg));
      dispatch(setStatus("error"));
      toast.error(errorMsg);
    }
  };

  // ── Simulation training ─────────────────────────────────────────────────────
  const handleSimulatedTraining = () => {
    const totalEpochs = Math.max(1, parseInt(params.num_epochs) || 3);
    const stepsPerEpoch = 30; // Steps shown per epoch in the simulation
    const msPerStep = 120;    // How fast each step ticks (ms)

    setSimProgress({
      currentEpoch: 0,
      totalEpochs,
      step: 0,
      totalSteps: stepsPerEpoch,
      loss: "—",
      accuracy: "—",
      phase: "preparing",
      phaseLabel: "🔄 Loading dataset and initializing model...",
    });
    dispatch(setStatus("training"));

    let epoch = 0;
    let step = 0;

    // Phase 1: "preparing" for 2 seconds
    const prepTimer = setTimeout(() => {
      epoch = 1;
      setSimProgress((prev) => ({
        ...prev,
        currentEpoch: epoch,
        phase: "training",
        phaseLabel: `📦 Epoch ${epoch} / ${totalEpochs}`,
        loss: simulateLoss(epoch, totalEpochs),
        accuracy: simulateAccuracy(epoch, totalEpochs),
      }));

      intervalRef.current = setInterval(() => {
        step += 1;

        if (step > stepsPerEpoch) {
          // Move to next epoch
          step = 0;
          epoch += 1;

          if (epoch > totalEpochs) {
            // Done!
            clearInterval(intervalRef.current);
            setSimProgress((prev) => ({
              ...prev,
              currentEpoch: totalEpochs,
              step: stepsPerEpoch,
              phase: "done",
              phaseLabel: "✅ Training complete!",
              loss: simulateLoss(totalEpochs, totalEpochs),
              accuracy: simulateAccuracy(totalEpochs, totalEpochs),
            }));

            // Mark step completed
            const newCompletedList = { ...completedList };
            newCompletedList[4] = true;
            dispatch(setCompletedList(newCompletedList));
            dispatch(setStatus("completed"));
            toast.success("Simulation complete! Model is ready to download.");
            return;
          }

          setSimProgress((prev) => ({
            ...prev,
            currentEpoch: epoch,
            step: 0,
            phaseLabel: `📦 Epoch ${epoch} / ${totalEpochs}`,
            loss: simulateLoss(epoch, totalEpochs),
            accuracy: simulateAccuracy(epoch, totalEpochs),
          }));
        } else {
          setSimProgress((prev) => ({
            ...prev,
            step,
            // Slight loss improvement within same epoch
            loss: (
              parseFloat(simulateLoss(epoch, totalEpochs)) +
              ((stepsPerEpoch - step) / stepsPerEpoch) * 0.08
            ).toFixed(4),
          }));
        }
      }, msPerStep);
    }, 2000);

    return () => {
      clearTimeout(prepTimer);
      clearInterval(intervalRef.current);
    };
  };

  // ── Entry point: try real, fall back to sim ─────────────────────────────────
  const handleStartTraining = async () => {
    try {
      // Quick connectivity check to the ngrok server (1.5s timeout)
      await axios.get(`${apiUrl}/status/ping`, {
        timeout: 1500,
        headers: { "ngrok-skip-browser-warning": "true" },
      });
      // If reachable → real training
      setIsDemoMode(false);
      await handleRealTraining();
    } catch {
      // Not reachable → simulation
      setIsDemoMode(true);
      handleSimulatedTraining();
    }
  };

  // ── Real polling (only when NOT demo mode) ──────────────────────────────────
  useEffect(() => {
    if (isDemoMode) return;
    let intervalId;
    if (status === "training" && jobId) {
      intervalId = setInterval(async () => {
        try {
          const response = await apiClient.get(`${apiUrl}/status/${jobId}`);
          const { status: jobStatus, message } = response.data;
          dispatch(setProgressMessage(message));

          if (jobStatus === "completed") {
            dispatch(setStatus("completed"));
            const newCompletedList = { ...completedList };
            newCompletedList[4] = true;
            dispatch(setCompletedList(newCompletedList));
          } else if (jobStatus === "error") {
            dispatch(setErrorMessage(message));
            dispatch(setStatus("error"));
            toast.error(`Error: ${message}`);
          }
        } catch (error) {
          console.error("Polling error:", error);
        }
      }, 2000);
    }
    return () => clearInterval(intervalId);
  }, [status, jobId, isDemoMode]);

  const handleDownload = () => {
    if (isDemoMode) {
      // Generate a realistic model config file in-browser
      const modelPackage = {
        model_name: "roberta-sentiment-chatgpt-finetuned",
        base_model: "cardiffnlp/twitter-roberta-base-sentiment-latest",
        architecture: "RoBERTa-base (125M parameters)",
        task: "Sentiment Classification (3-class)",
        labels: { 0: "Negative", 1: "Neutral", 2: "Positive" },
        training_config: {
          learning_rate: parseFloat(params.learning_rate),
          num_epochs: parseInt(params.num_epochs),
          batch_size: parseInt(params.batch_size),
          weight_decay: parseFloat(params.weight_decay),
          optimizer: "AdamW",
          scheduler: "linear_warmup",
          max_seq_length: 128,
          training_samples: trainingData?.length || 37028,
        },
        final_metrics: {
          training_loss: parseFloat(simProgress.loss) || 0.0894,
          accuracy: parseFloat(simProgress.accuracy) || 0.9741,
          eval_f1_macro: 0.9685,
        },
        files_included: [
          "pytorch_model.bin (478 MB)",
          "config.json",
          "tokenizer.json",
          "special_tokens_map.json",
          "training_args.bin",
        ],
        note: "This is a demo model configuration file generated by SentimenAI. In a real training session, this package would include the full PyTorch model checkpoint (~478 MB) along with tokenizer files.",
        exported_at: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(modelPackage, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "roberta_sentiment_model_config.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Model config downloaded!");
    } else {
      window.open(`${apiUrl}/download/${jobId}`, "_blank");
    }
  };

  const handleReset = () => {
    clearInterval(intervalRef.current);
    setIsDemoMode(false);
    setSimProgress({
      currentEpoch: 0, totalEpochs: 3, step: 0, totalSteps: 30,
      loss: "—", accuracy: "—", phase: "idle", phaseLabel: "",
    });
    dispatch(resetFineTune());
  };

  // Progress percentage for the bar
  const overallProgress = simProgress.phase === "done"
    ? 100
    : simProgress.phase === "preparing"
      ? 5
      : Math.round(
          ((simProgress.currentEpoch - 1 + simProgress.step / simProgress.totalSteps) /
            simProgress.totalEpochs) *
            100,
        );

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <Paper className="trainer-container" elevation={0}>
      <ToastContainer theme="colored" position="top-center" />
      <div className="trainer-card">

        {/* Demo Mode Banner */}
        {isDemoMode && (
          <div
            style={{
              background: "linear-gradient(90deg, #f0f9ff, #e0f2fe)",
              borderBottom: "1px solid #bae6fd",
              padding: "8px 16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "12px",
              color: "#0369a1",
              fontWeight: 500,
            }}
          >
            <FiInfo size={14} />
            <span>
              <strong>Demo Mode</strong> — Training server offline. Showing a
              realistic simulation. In development, this connects to a live GPU
              server via ngrok.
            </span>
          </div>
        )}

        {/* Card Header */}
        <div className="card-header">
          <FiCpu className="header-icon" />
          <h2>Fine-tuning the RoBERTa model</h2>
          <p>Set the parameters below and start fine-tuning</p>
        </div>

        {/* ── IDLE STATE: Form ── */}
        {status === "idle" && (
          <div className="card-body">
            <form className="params-form">
              <div className="form-column">
                <div className="form-group">
                  <label htmlFor="learning_rate">Learning Rate</label>
                  <input
                    type="text"
                    id="learning_rate"
                    name="learning_rate"
                    value={params.learning_rate}
                    onChange={handleParamChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="num_epochs">Epochs</label>
                  <input
                    type="number"
                    id="num_epochs"
                    name="num_epochs"
                    min="1"
                    max="10"
                    value={params.num_epochs}
                    onChange={handleParamChange}
                  />
                </div>
              </div>
              <div className="form-column">
                <div className="form-group">
                  <label htmlFor="batch_size">Batch Size</label>
                  <input
                    type="number"
                    id="batch_size"
                    name="batch_size"
                    value={params.batch_size}
                    onChange={handleParamChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="weight_decay">Weight Decay</label>
                  <input
                    type="number"
                    id="weight_decay"
                    name="weight_decay"
                    step="0.001"
                    value={params.weight_decay}
                    onChange={handleParamChange}
                  />
                </div>
              </div>
            </form>
            <button className="btn btn-primary" onClick={handleStartTraining}>
              <FiPlayCircle /> Start Fine-Tuning
            </button>
          </div>
        )}

        {/* ── TRAINING STATE: Progress (simulation or real) ── */}
        {status === "training" && (
          <div className="card-body-center" style={{ gap: "16px", padding: "2rem" }}>
            {/* Animated spinner */}
            <div className="loading-spinner" />

            <h3 style={{ margin: 0 }}>
              {isDemoMode ? simProgress.phaseLabel : "Training in Progress..."}
            </h3>

            {/* Progress bar (simulation only) */}
            {isDemoMode && (
              <div style={{ width: "100%", maxWidth: 420 }}>
                <div
                  style={{
                    width: "100%",
                    height: 10,
                    background: "#e5e7eb",
                    borderRadius: 99,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${overallProgress}%`,
                      height: "100%",
                      background: "linear-gradient(90deg, #7c3aed, #a78bfa)",
                      borderRadius: 99,
                      transition: "width 0.15s ease",
                    }}
                  />
                </div>
                <p
                  style={{
                    textAlign: "center",
                    fontSize: 12,
                    color: "#6b7280",
                    margin: "6px 0 0",
                  }}
                >
                  {overallProgress}% complete
                </p>
              </div>
            )}

            {/* Epoch metrics (simulation only) */}
            {isDemoMode && simProgress.phase === "training" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  width: "100%",
                  maxWidth: 420,
                }}
              >
                {[
                  { label: "Epoch", value: `${simProgress.currentEpoch} / ${simProgress.totalEpochs}` },
                  { label: "Step", value: `${simProgress.step} / ${simProgress.totalSteps}` },
                  { label: "Training Loss", value: simProgress.loss },
                  { label: "Accuracy", value: simProgress.accuracy ? `${(simProgress.accuracy * 100).toFixed(2)}%` : "—" },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    style={{
                      background: "#f9fafb",
                      border: "1px solid #e5e7eb",
                      borderRadius: 10,
                      padding: "10px 14px",
                      textAlign: "center",
                    }}
                  >
                    <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {label}
                    </p>
                    <p style={{ fontSize: 18, fontWeight: 700, color: "#1f2937", margin: 0, fontVariantNumeric: "tabular-nums" }}>
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Params summary */}
            <p style={{ fontSize: 12, color: "#9ca3af", margin: 0, textAlign: "center" }}>
              lr={params.learning_rate} &nbsp;|&nbsp; epochs={params.num_epochs} &nbsp;|&nbsp; batch={params.batch_size} &nbsp;|&nbsp; decay={params.weight_decay}
            </p>
          </div>
        )}

        {/* ── COMPLETED STATE ── */}
        {status === "completed" && (
          <div className="card-body-center">
            <FiCheckCircle className="status-icon success" />
            <h3>Training Complete!</h3>
            <p>
              {isDemoMode
                ? "Your model has been successfully trained (demo simulation). Click below to download the pre-built model."
                : "Your model has been successfully created and is ready to download."}
            </p>
            <button className="btn btn-success" onClick={handleDownload}>
              <FiDownload /> Download Model
            </button>
            <button className="btn btn-secondary" onClick={handleReset}>
              Train Another Model
            </button>
          </div>
        )}

        {/* ── ERROR STATE ── */}
        {status === "error" && (
          <div className="card-body-center">
            <FiXCircle className="status-icon error" />
            <h3>An Error Occurred</h3>
            <p className="error-message">{errorMessage}</p>
            <button className="btn btn-primary" onClick={handleReset}>
              Try Again
            </button>
          </div>
        )}
      </div>
    </Paper>
  );
};

export default FineTunePaper;
