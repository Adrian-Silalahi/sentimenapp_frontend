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
import { setCompletedList, setActiveStep } from "../../../../redux/stepslice";
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
  const noise = Math.sin(epoch * seed * 7.3) * 0.02;
  return Math.max(0.05, base + noise).toFixed(4);
};

const simulateAccuracy = (epoch, totalEpochs) => {
  const base = 0.6 + (epoch / totalEpochs) * 0.38;
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
          case "positive":
            labelValue = 2;
            break;
          case "neutral":
            labelValue = 1;
            break;
          case "negative":
            labelValue = 0;
            break;
          default:
            labelValue = row[1];
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
    const msPerStep = 120; // How fast each step ticks (ms)

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
      currentEpoch: 0,
      totalEpochs: 3,
      step: 0,
      totalSteps: 30,
      loss: "—",
      accuracy: "—",
      phase: "idle",
      phaseLabel: "",
    });
    dispatch(resetFineTune());
  };

  // Progress percentage for the bar
  const overallProgress =
    simProgress.phase === "done"
      ? 100
      : simProgress.phase === "preparing"
        ? 5
        : Math.round(
            ((simProgress.currentEpoch -
              1 +
              simProgress.step / simProgress.totalSteps) /
              simProgress.totalEpochs) *
              100,
          );

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <Paper
      className="trainer-container bg-transparent flex flex-col items-center w-full"
      elevation={0}
      style={{ backgroundColor: "transparent" }}
    >
      <ToastContainer theme="colored" position="top-center" />

      {/* Contextual Navigation */}
      <div className="w-full max-w-[800px] mx-auto flex justify-start mb-4">
        <button
          className="flex items-center gap-2 text-secondary hover:text-on-surface transition-colors group"
          onClick={() => dispatch(setActiveStep(4))}
        >
          <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">
            arrow_back
          </span>
          <span className="font-label-sm text-label-sm">
            Back to Data Balancing
          </span>
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] p-6 md:p-8 flex flex-col gap-6 border border-surface-container-highest w-full max-w-[800px] mx-auto relative overflow-hidden">
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
        <header className="flex gap-4 items-start border-b border-surface-container pb-6">
          <div className="shrink-0 w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
            <span
              className="material-symbols-outlined text-[28px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              psychology
            </span>
          </div>
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">
              Fine-tuning the RoBERTa model
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2">
              Configure the core hyperparameters below to optimize the base
              model for your specific downstream classification task.
            </p>
          </div>
        </header>

        {/* ── IDLE STATE: Form ── */}
        {status === "idle" && (
          <div className="flex flex-col gap-8">
            <section className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
              {/* Learning Rate */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <label
                    className="font-label-sm text-label-sm text-on-surface"
                    htmlFor="learning_rate"
                  >
                    Learning Rate
                  </label>
                  <div className="group relative flex items-center justify-center w-4 h-4 rounded-full border border-outline text-outline hover:border-primary hover:text-primary transition-colors cursor-help">
                    <span className="font-caption-xs text-caption-xs text-[10px] font-bold leading-none">
                      i
                    </span>
                    <div className="absolute bottom-[150%] left-1/2 -translate-x-1/2 w-60 p-4 bg-inverse-surface rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 shadow-lg">
                      <p className="font-caption-xs text-caption-xs text-on-primary">
                        The speed at which the model adjusts its parameters
                        based on error.
                      </p>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-inverse-surface"></div>
                    </div>
                  </div>
                </div>
                <input
                  className="w-full bg-surface-bright border border-outline-variant rounded-md px-4 py-3 font-body-md text-body-md text-on-surface font-mono tracking-wider focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary-container transition-all"
                  id="learning_rate"
                  name="learning_rate"
                  step="0.00001"
                  type="text"
                  value={params.learning_rate}
                  onChange={handleParamChange}
                />
              </div>

              {/* Batch Size */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <label
                    className="font-label-sm text-label-sm text-on-surface"
                    htmlFor="batch_size"
                  >
                    Batch Size
                  </label>
                  <div className="group relative flex items-center justify-center w-4 h-4 rounded-full border border-outline text-outline hover:border-primary hover:text-primary transition-colors cursor-help">
                    <span className="font-caption-xs text-caption-xs text-[10px] font-bold leading-none">
                      i
                    </span>
                    <div className="absolute bottom-[150%] left-1/2 -translate-x-1/2 w-60 p-4 bg-inverse-surface rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 shadow-lg">
                      <p className="font-caption-xs text-caption-xs text-on-primary">
                        The number of data samples processed before the model
                        updates its parameters.
                      </p>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-inverse-surface"></div>
                    </div>
                  </div>
                </div>
                <input
                  className="w-full bg-surface-bright border border-outline-variant rounded-md px-4 py-3 font-body-md text-body-md text-on-surface font-mono tracking-wider focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary-container transition-all"
                  id="batch_size"
                  name="batch_size"
                  step="8"
                  type="number"
                  value={params.batch_size}
                  onChange={handleParamChange}
                />
              </div>

              {/* Epochs */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <label
                    className="font-label-sm text-label-sm text-on-surface"
                    htmlFor="num_epochs"
                  >
                    Epochs
                  </label>
                  <div className="group relative flex items-center justify-center w-4 h-4 rounded-full border border-outline text-outline hover:border-primary hover:text-primary transition-colors cursor-help">
                    <span className="font-caption-xs text-caption-xs text-[10px] font-bold leading-none">
                      i
                    </span>
                    <div className="absolute bottom-[150%] left-1/2 -translate-x-1/2 w-60 p-4 bg-inverse-surface rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 shadow-lg">
                      <p className="font-caption-xs text-caption-xs text-on-primary">
                        How many times the model will see the entire training
                        dataset.
                      </p>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-inverse-surface"></div>
                    </div>
                  </div>
                </div>
                <input
                  className="w-full bg-surface-bright border border-outline-variant rounded-md px-4 py-3 font-body-md text-body-md text-on-surface font-mono tracking-wider focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary-container transition-all"
                  id="num_epochs"
                  name="num_epochs"
                  min="1"
                  max="10"
                  step="1"
                  type="number"
                  value={params.num_epochs}
                  onChange={handleParamChange}
                />
              </div>

              {/* Weight Decay */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <label
                    className="font-label-sm text-label-sm text-on-surface"
                    htmlFor="weight_decay"
                  >
                    Weight Decay
                  </label>
                  <div className="group relative flex items-center justify-center w-4 h-4 rounded-full border border-outline text-outline hover:border-primary hover:text-primary transition-colors cursor-help">
                    <span className="font-caption-xs text-caption-xs text-[10px] font-bold leading-none">
                      i
                    </span>
                    <div className="absolute bottom-[150%] right-0 md:left-1/2 md:-translate-x-1/2 w-60 p-4 bg-inverse-surface rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 shadow-lg">
                      <p className="font-caption-xs text-caption-xs text-on-primary">
                        A regularization technique to prevent overfitting by
                        penalizing large weights.
                      </p>
                      <div className="absolute top-full right-[8px] md:left-1/2 md:-translate-x-1/2 border-[6px] border-transparent border-t-inverse-surface"></div>
                    </div>
                  </div>
                </div>
                <input
                  className="w-full bg-surface-bright border border-outline-variant rounded-md px-4 py-3 font-body-md text-body-md text-on-surface font-mono tracking-wider focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary-container transition-all"
                  id="weight_decay"
                  name="weight_decay"
                  step="0.01"
                  type="number"
                  value={params.weight_decay}
                  onChange={handleParamChange}
                />
              </div>
            </section>

            <footer className="mt-2 pt-6 border-t border-surface-container flex justify-end">
              <button
                className="w-full md:w-auto bg-[#630ed4] text-white font-label-sm text-label-sm px-12 py-[14px] rounded-lg shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2)] hover:bg-[#5a00c6] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                onClick={handleStartTraining}
              >
                <span className="material-symbols-outlined text-[20px]">
                  model_training
                </span>
                Start Fine-Tuning
              </button>
            </footer>
          </div>
        )}

        {/* ── TRAINING STATE: Progress (simulation or real) ── */}
        {status === "training" && (
          <div
            className="card-body-center"
            style={{ gap: "16px", padding: "2rem" }}
          >
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
                  {
                    label: "Epoch",
                    value: `${simProgress.currentEpoch} / ${simProgress.totalEpochs}`,
                  },
                  {
                    label: "Batch",
                    value: `${simProgress.step} / ${simProgress.totalSteps}`,
                  },
                  { label: "Training Loss", value: simProgress.loss },
                  {
                    label: "Accuracy",
                    value: simProgress.accuracy
                      ? `${(simProgress.accuracy * 100).toFixed(2)}%`
                      : "—",
                  },
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
                    <p
                      style={{
                        fontSize: 11,
                        color: "#9ca3af",
                        margin: "0 0 2px",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {label}
                    </p>
                    <p
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: "#1f2937",
                        margin: 0,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Params summary */}
            <p
              style={{
                fontSize: 12,
                color: "#9ca3af",
                margin: 0,
                textAlign: "center",
              }}
            >
              lr={params.learning_rate} &nbsp;|&nbsp; epochs={params.num_epochs}{" "}
              &nbsp;|&nbsp; batch={params.batch_size} &nbsp;|&nbsp; decay=
              {params.weight_decay}
            </p>
          </div>
        )}

        {/* ── COMPLETED STATE ── */}
        {status === "completed" && (
          <div className="flex flex-col w-full">
            {/* Premium Top Accent Border */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#005b3d] via-[#4edea3] to-[#630ed4]/80 absolute top-0 left-0"></div>

            <div className="mt-1">
              {/* Success Header Area */}
              <div className="flex flex-col items-center text-center space-y-3 mb-6">
                <div className="relative w-20 h-20 rounded-full bg-surface-container flex items-center justify-center shadow-inner overflow-hidden">
                  <div className="absolute inset-0 bg-[#005b3d]/10 scale-150 rounded-full"></div>
                  <div className="relative w-14 h-14 rounded-full bg-[#005b3d] flex items-center justify-center shadow-[0_0_20px_rgba(0,91,61,0.3)] ring-4 ring-[#6ffbbe]/30">
                    <span
                      className="material-symbols-outlined text-[36px] text-white"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      check
                    </span>
                  </div>
                </div>
                <div>
                  <h1 className="font-display-lg text-[28px] leading-tight text-on-surface mb-1">
                    Training Complete
                  </h1>
                  <p className="font-body-md text-[14px] text-on-surface-variant max-w-md mx-auto">
                    {isDemoMode
                      ? "Your model has been successfully trained (demo simulation). It is now ready for deployment or immediate download."
                      : "Your model has been successfully fine-tuned and verified. It is now ready for deployment or immediate download."}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-outline-variant/40 my-4 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-outline-variant/60 to-transparent"></div>
              </div>

              {/* Training Summary (Bento Grid Layout) */}
              <div className="mb-6">
                <div className="flex items-center gap-1 mb-3 px-1">
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    analytics
                  </span>
                  <h2 className="font-title-sm text-[16px] text-on-surface">
                    Training Summary
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Grid Cell 1: Learning Rate */}
                  <div className="bg-surface rounded-lg border border-outline-variant/60 p-3 flex flex-col justify-between hover:border-primary/40 hover:bg-surface-container-low transition-all duration-300 relative overflow-hidden group/cell">
                    <div className="absolute top-0 right-0 p-3 opacity-5 group-hover/cell:opacity-10 transition-opacity">
                      <span className="material-symbols-outlined text-[56px] text-primary">
                        speed
                      </span>
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-1 text-on-surface-variant mb-1">
                        <span className="material-symbols-outlined text-[18px]">
                          speed
                        </span>
                        <span className="font-label-sm text-[13px]">
                          Learning Rate
                        </span>
                      </div>
                      <div className="font-headline-md text-[20px] font-bold text-primary font-mono tracking-tighter mb-2 drop-shadow-sm">
                        {params.learning_rate}
                      </div>
                      <div className="border-t border-outline-variant/40 pt-1 mt-auto">
                        <p className="font-caption-xs text-[11px] text-on-surface-variant/90 leading-tight">
                          Controls how fast the model learns. A smaller value
                          means more stable but slower training.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Grid Cell 2: Batch Size */}
                  <div className="bg-surface rounded-lg border border-outline-variant/60 p-3 flex flex-col justify-between hover:border-primary/40 hover:bg-surface-container-low transition-all duration-300 relative overflow-hidden group/cell">
                    <div className="absolute top-0 right-0 p-3 opacity-5 group-hover/cell:opacity-10 transition-opacity">
                      <span className="material-symbols-outlined text-[56px] text-primary">
                        layers
                      </span>
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-1 text-on-surface-variant mb-1">
                        <span className="material-symbols-outlined text-[18px]">
                          layers
                        </span>
                        <span className="font-label-sm text-[13px]">
                          Batch Size
                        </span>
                      </div>
                      <div className="font-headline-md text-[20px] font-bold text-primary font-mono tracking-tighter mb-2 drop-shadow-sm">
                        {params.batch_size}
                      </div>
                      <div className="border-t border-outline-variant/40 pt-1 mt-auto">
                        <p className="font-caption-xs text-[11px] text-on-surface-variant/90 leading-tight">
                          Number of training examples used in one iteration.
                          Affects memory usage and stability.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Grid Cell 3: Epochs */}
                  <div className="bg-surface rounded-lg border border-outline-variant/60 p-3 flex flex-col justify-between hover:border-primary/40 hover:bg-surface-container-low transition-all duration-300 relative overflow-hidden group/cell">
                    <div className="absolute top-0 right-0 p-3 opacity-5 group-hover/cell:opacity-10 transition-opacity">
                      <span className="material-symbols-outlined text-[56px] text-primary">
                        autorenew
                      </span>
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-1 text-on-surface-variant mb-1">
                        <span className="material-symbols-outlined text-[18px]">
                          autorenew
                        </span>
                        <span className="font-label-sm text-[13px]">
                          Epochs
                        </span>
                      </div>
                      <div className="font-headline-md text-[20px] font-bold text-primary font-mono tracking-tighter mb-2 drop-shadow-sm">
                        {params.num_epochs}
                      </div>
                      <div className="border-t border-outline-variant/40 pt-1 mt-auto">
                        <p className="font-caption-xs text-[11px] text-on-surface-variant/90 leading-tight">
                          How many times the model sees the entire dataset. More
                          epochs can improve accuracy but take longer.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Grid Cell 4: Weight Decay */}
                  <div className="bg-surface rounded-lg border border-outline-variant/60 p-3 flex flex-col justify-between hover:border-primary/40 hover:bg-surface-container-low transition-all duration-300 relative overflow-hidden group/cell">
                    <div className="absolute top-0 right-0 p-3 opacity-5 group-hover/cell:opacity-10 transition-opacity">
                      <span className="material-symbols-outlined text-[56px] text-primary">
                        tune
                      </span>
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-1 text-on-surface-variant mb-1">
                        <span className="material-symbols-outlined text-[18px]">
                          tune
                        </span>
                        <span className="font-label-sm text-[13px]">
                          Weight Decay
                        </span>
                      </div>
                      <div className="font-headline-md text-[20px] font-bold text-primary font-mono tracking-tighter mb-2 drop-shadow-sm">
                        {params.weight_decay}
                      </div>
                      <div className="border-t border-outline-variant/40 pt-1 mt-auto">
                        <p className="font-caption-xs text-[11px] text-on-surface-variant/90 leading-tight">
                          Prevents the model from becoming too complex, helping
                          it generalize better to new data.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Area */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                {/* Primary CTA (Success Green) */}
                <button
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#005b3d] text-white px-8 py-3.5 rounded-lg shadow-[inset_0_4px_4px_rgba(255,255,255,0.1),0_4px_12px_rgba(0,91,61,0.2)] hover:bg-[#004a32] active:scale-[0.98] transition-all duration-150"
                  onClick={handleDownload}
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    download
                  </span>
                  <span className="font-label-sm text-label-sm">
                    Download Model
                  </span>
                </button>
                {/* Secondary CTA (Outlined/Gray) */}
                <button
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-transparent border border-outline text-on-surface px-8 py-3.5 rounded-lg hover:bg-surface-variant/50 hover:border-outline-variant active:scale-[0.98] transition-all duration-150"
                  onClick={handleReset}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    add_circle
                  </span>
                  <span className="font-label-sm text-label-sm">
                    Train Another Model
                  </span>
                </button>
              </div>
            </div>
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
