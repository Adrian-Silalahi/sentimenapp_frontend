import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEvaluationMetrics } from "../../../../hooks/useEvaluationMetrics";
import CountUp from "react-countup";
import { setActiveStep } from "../../../../redux/stepslice";

// --- Types ---
interface DataProcessingState {
  data_balance: boolean;
  roberta: [string, string][];
  vader_label: string[];
}

interface RootState {
  dataProcessing: DataProcessingState;
}

interface StatCardProps {
  label: string;
  icon: string;
  children: React.ReactNode;
  accent?: "primary" | "tertiary" | "default";
}

interface MatrixCellProps {
  value: number;
  isDiagonal: boolean;
  intensity: number;
}

interface BinaryCardProps {
  tp: number;
  fp: number;
  fn: number;
  tn: number;
}

// --- Color tokens (Tailwind mapping based on tailwind.config.js & design) ---
const labelColorMap: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  Positive: { bg: "#dcfce7", text: "#15803d", border: "#86efac" }, // emerald-100, emerald-700, emerald-300
  Negative: { bg: "#fee2e2", text: "#dc2626", border: "#fca5a5" }, // red-100, red-600, red-300
  Neutral: { bg: "#f1f5f9", text: "#475569", border: "#cbd5e1" }, // slate-100, slate-600, slate-300
};

// --- Sub-components ---

const StatCard: React.FC<StatCardProps> = ({
  label,
  icon,
  children,
  accent,
}) => {
  let iconBg = "bg-surface-container-highest"; // default
  let iconText = "text-on-surface-variant";
  if (accent === "primary") {
    iconBg = "bg-primary-container";
    iconText = "text-on-primary-container";
  } else if (accent === "tertiary") {
    iconBg = "bg-tertiary-fixed"; // #ffddb8 from tailwind config
    iconText = "text-on-tertiary-fixed"; // #2a1700
  }

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-3 md:p-4 lg:p-6 flex flex-col gap-2 min-w-0 hover:shadow-sm transition-shadow">
      <div className="flex justify-between items-start">
        <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
          {label}
        </span>
        <div
          className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center ${iconBg} ${iconText}`}
        >
          <span className="material-symbols-outlined text-[16px] md:text-[18px]">
            {icon}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
};

const MatrixCell: React.FC<MatrixCellProps> = ({
  value,
  isDiagonal,
  intensity,
}) => {
  // Map intensity to specific Tailwind hex colors based on design tokens
  const bg = isDiagonal
    ? intensity > 0.5
      ? "#006c49" // primary
      : "#10b981" // primary-container
    : intensity > 0.3
      ? "#e6e8ea" // surface-container-high
      : "#f2f4f6"; // surface-container-low

  const color = isDiagonal ? "#ffffff" : "#191c1e";

  return (
    <div
      className="w-[45px] h-[40px] md:w-[60px] md:h-[52px] flex items-center justify-center text-xs md:text-[13px] font-semibold rounded-[5px] cursor-default transition-all hover:brightness-90"
      style={{ background: bg, color }}
    >
      <CountUp end={value} duration={1} />
    </div>
  );
};

const BinaryCard: React.FC<BinaryCardProps> = ({ tp, fp, fn, tn }) => (
  <div className="grid grid-cols-2 gap-2 w-full max-w-[320px]">
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-3 flex flex-col items-center gap-1 shadow-sm">
      <span className="text-[10px] md:text-xs font-medium text-on-surface-variant text-center">
        True Positive
      </span>
      <span className="text-lg md:text-xl font-bold leading-none text-primary">
        <CountUp end={tp} duration={1} />
      </span>
    </div>
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-3 flex flex-col items-center gap-1 shadow-sm">
      <span className="text-[10px] md:text-xs font-medium text-on-surface-variant text-center">
        False Positive
      </span>
      <span className="text-lg md:text-xl font-bold leading-none text-error">
        <CountUp end={fp} duration={1} />
      </span>
    </div>
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-3 flex flex-col items-center gap-1 shadow-sm">
      <span className="text-[10px] md:text-xs font-medium text-on-surface-variant text-center">
        False Negative
      </span>
      <span className="text-lg md:text-xl font-bold leading-none text-error">
        <CountUp end={fn} duration={1} />
      </span>
    </div>
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-3 flex flex-col items-center gap-1 shadow-sm">
      <span className="text-[10px] md:text-xs font-medium text-on-surface-variant text-center">
        True Negative
      </span>
      <span className="text-lg md:text-xl font-bold leading-none text-on-surface">
        <CountUp end={tn} duration={1} />
      </span>
    </div>
  </div>
);

// --- Main Component ---
const EvaluatePaper: React.FC = () => {
  const dispatch = useDispatch();
  const { data_balance, roberta, vader_label } = useSelector(
    (state: RootState) => state.dataProcessing,
  );

  const [actualLabels, setActualLabels] = useState<string[][]>([]);
  const [predictedLabels, setPredictedLabels] = useState<string[][]>([]);
  const [binaryIndex, setBinaryIndex] = useState(0);

  useEffect(() => {
    setActualLabels(vader_label.map((item) => [item]));
    setPredictedLabels(roberta.map((item) => [item[1]]));
  }, [data_balance, roberta, vader_label]);

  const { metrics, isLoading } = useEvaluationMetrics(
    actualLabels,
    predictedLabels,
  ) as any;

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-on-surface-variant text-sm">
        <div className="w-8 h-8 border-4 border-outline-variant border-t-primary-container rounded-full animate-spin" />
        <p>Calculating evaluation metrics...</p>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-on-surface-variant text-sm">
        Data is unavailable or invalid.
      </div>
    );
  }

  const {
    confusionMatrix,
    overallAccuracy,
    classMetrics,
    totalData,
    labels,
    binaryConfusionMatrix,
  } = metrics;
  const accuracyPct = (overallAccuracy * 100).toFixed(2);

  const bestClass = labels.reduce(
    (best: string, l: string) =>
      classMetrics[l].f1Score > (classMetrics[best]?.f1Score ?? 0) ? l : best,
    labels[0],
  );

  const currentLabel = labels[binaryIndex] ?? labels[0];
  const binMatrix = binaryConfusionMatrix[currentLabel] ?? {};
  const posKey = currentLabel;
  const negKey = `Not ${currentLabel}`;
  const tp = binMatrix[posKey]?.[posKey] ?? 0;
  const fp = binMatrix[negKey]?.[posKey] ?? 0;
  const fn = binMatrix[posKey]?.[negKey] ?? 0;
  const tn = binMatrix[negKey]?.[negKey] ?? 0;

  const getIntensity = (actual: string, predicted: string) => {
    const rowMax = Math.max(
      ...labels.map((p: string) => confusionMatrix[actual][p]),
    );
    return rowMax > 0 ? confusionMatrix[actual][predicted] / rowMax : 0;
  };

  return (
    <div className="w-full flex-1 min-h-0 overflow-y-auto flex flex-col gap-[6px] font-body-md text-[13px] text-on-surface py-1 bg-surface animate-[fadeIn_0.35s_ease-out]">
      {/* Inline keyframes for fallback if tailwind animate-fade-in isn't configured */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f7f9fb;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d8dadc;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #bbcabf;
        }
      `}</style>

      {/* Back link */}
      <button
        className="inline-flex items-center gap-1 bg-transparent border-none cursor-pointer text-on-surface-variant text-[11px] font-medium p-0 shrink-0 transition-colors hover:text-primary w-fit mb-1"
        onClick={() => dispatch(setActiveStep(4))}
      >
        <span className="material-symbols-outlined text-[14px]">
          arrow_back
        </span>
        Back to RoBERTa
      </button>

      {/* Informational Banner */}
      <div className="bg-[#f0f9ff] border border-[#bae6fd] rounded-lg p-3 md:p-4 flex gap-3 text-[#0369a1] shrink-0 mb-1">
        <span className="material-symbols-outlined text-[#0ea5e9] shrink-0 mt-0.5">info</span>
        <div>
          <h4 className="font-label-bold text-label-bold mb-1">Model Evaluation Tool</h4>
          <p className="font-body-sm text-body-sm text-[#0369a1]/80 leading-relaxed">
            This tool automatically calculates comprehensive metrics (Accuracy, F1-Score, Confusion Matrix) to evaluate <strong>any custom model</strong> you fine-tune on this platform. The data displayed below shows the evaluation of our default RoBERTa model trained on 37,000+ public opinions. <br className="hidden md:block"/>
            <em>(Note: While custom models are evaluated here, the live prediction feature on the dashboard uses the Groq API for 24/7 demo availability without GPU limits).</em>
          </p>
        </div>
      </div>

      {/* ── 1. Stat Cards ── */}
      <section className="grid grid-cols-3 gap-2 shrink-0">
        <StatCard label="Total Data" icon="database" accent="default">
          <span className="text-xl font-bold leading-tight text-on-surface">
            <CountUp end={totalData} duration={1.2} separator="," />
          </span>
          <span className="text-[11px] text-on-surface-variant flex items-center gap-0.5">
            Samples in dataset
          </span>
        </StatCard>

        <StatCard label="Overall Accuracy" icon="check_circle" accent="primary">
          <span className="text-xl font-bold leading-tight text-primary">
            <CountUp
              end={parseFloat(accuracyPct)}
              duration={1.8}
              decimals={2}
            />
            %
          </span>
          <span className="text-[11px] text-primary flex items-center gap-0.5">
            <span className="material-symbols-outlined text-[14px]">
              trending_up
            </span>
            Model prediction results
          </span>
        </StatCard>

        <StatCard label="Best Class" icon="workspace_premium" accent="tertiary">
          <span className="text-xl font-bold leading-tight text-on-surface">
            {bestClass}
          </span>
          <span className="text-[11px] text-on-surface-variant flex items-center gap-0.5">
            F1-Score: {(classMetrics[bestClass]?.f1Score * 100).toFixed(1)}%
          </span>
        </StatCard>
      </section>

      {/* ── 2. Matrix Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 flex-1 min-h-0">
        {/* Multiclass Confusion Matrix */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-[10px] overflow-hidden flex flex-col min-w-0 min-h-0">
          <div className="flex justify-between items-center px-3.5 pt-2.5 pb-2 shrink-0">
            <h2 className="m-0 text-[13px] font-semibold text-on-surface">
              Multiclass Confusion Matrix
            </h2>
          </div>
          <div className="flex-1 p-2 px-3 pb-2.5 overflow-auto custom-scrollbar flex items-center justify-center min-h-0">
            <div
              className="grid gap-[3px] w-fit"
              style={{
                gridTemplateColumns: `auto repeat(${labels.length}, 1fr)`,
              }}
            >
              <div /> {/* Corner */}
              {labels.map((l: string) => (
                <div
                  key={l}
                  className="text-[10px] font-semibold text-center text-on-surface-variant pt-[3px] px-[2px] pb-[5px] border-b border-outline-variant whitespace-nowrap"
                >
                  Pred: {l}
                </div>
              ))}
              {labels.map((actual: string) => (
                <React.Fragment key={`row-${actual}`}>
                  <div className="flex items-center justify-end text-[10px] font-semibold text-on-surface-variant pr-2 border-r border-outline-variant whitespace-nowrap">
                    Act: {actual}
                  </div>
                  {labels.map((predicted: string) => {
                    const val = confusionMatrix[actual][predicted];
                    const isDiag = actual === predicted;
                    const intensity = getIntensity(actual, predicted);
                    return (
                      <MatrixCell
                        key={predicted}
                        value={val}
                        isDiagonal={isDiag}
                        intensity={intensity}
                      />
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* Binary Analysis */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-[10px] overflow-hidden flex flex-col min-w-0 min-h-0">
          <div className="flex justify-between items-center px-3.5 pt-2.5 pb-2 shrink-0">
            <h2 className="m-0 text-[13px] font-semibold text-on-surface">
              Binary Analysis (One-vs-Rest)
            </h2>
            <div className="flex gap-1.5">
              <button
                className="w-[26px] h-[26px] rounded-full border border-outline-variant bg-surface-container-lowest text-on-surface-variant flex items-center justify-center cursor-pointer transition-colors hover:bg-surface-container-high hover:text-on-surface disabled:opacity-30 disabled:cursor-not-allowed p-0"
                onClick={() => setBinaryIndex((i) => Math.max(0, i - 1))}
                disabled={binaryIndex === 0}
              >
                <span className="material-symbols-outlined text-[12px]">
                  arrow_back_ios_new
                </span>
              </button>
              <button
                className="w-[26px] h-[26px] rounded-full border border-outline-variant bg-surface-container-lowest text-on-surface-variant flex items-center justify-center cursor-pointer transition-colors hover:bg-surface-container-high hover:text-on-surface disabled:opacity-30 disabled:cursor-not-allowed p-0"
                onClick={() =>
                  setBinaryIndex((i) => Math.min(labels.length - 1, i + 1))
                }
                disabled={binaryIndex === labels.length - 1}
              >
                <span className="material-symbols-outlined text-[12px]">
                  arrow_forward_ios
                </span>
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center gap-2.5 pt-1.5 px-3 pb-2.5 min-h-0">
            <div
              className="inline-flex items-center gap-1 px-2.5 py-[3px] rounded-full text-[11px] font-semibold"
              style={{
                background: labelColorMap[currentLabel]?.bg,
                color: labelColorMap[currentLabel]?.text,
                border: `1px solid ${labelColorMap[currentLabel]?.border}`,
              }}
            >
              <span className="material-symbols-outlined text-[12px]">
                add_circle
              </span>
              {currentLabel} vs Rest
            </div>
            <BinaryCard tp={tp} fp={fp} fn={fn} tn={tn} />

            <div className="flex gap-1.5">
              {labels.map((_: any, i: number) => (
                <button
                  key={i}
                  className={`w-[7px] h-[7px] rounded-full border-none cursor-pointer p-0 transition-all ${
                    i === binaryIndex
                      ? "bg-primary-container scale-125"
                      : "bg-outline-variant"
                  }`}
                  onClick={() => setBinaryIndex(i)}
                />
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ── 3. Class Performance Metrics Table ── */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-[10px] overflow-hidden flex flex-col min-w-0 shrink-0">
        <div className="flex justify-between items-center px-3.5 py-2.5 border-b border-outline-variant shrink-0">
          <h2 className="m-0 text-[13px] font-semibold text-on-surface">
            Class Performance Metrics
          </h2>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse min-w-[400px]">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="py-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant text-left whitespace-nowrap">
                  Class
                </th>
                <th className="py-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant text-right whitespace-nowrap">
                  Precision
                </th>
                <th className="py-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant text-right whitespace-nowrap">
                  Recall
                </th>
                <th className="py-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant text-right whitespace-nowrap">
                  F1-Score
                </th>
                <th className="py-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant text-right whitespace-nowrap">
                  Support
                </th>
              </tr>
            </thead>
            <tbody>
              {labels.map((label: string) => {
                const m = classMetrics[label];
                const c = labelColorMap[label] ?? labelColorMap["Neutral"];
                const isBest = label === bestClass;
                return (
                  <tr
                    key={label}
                    className="transition-colors hover:bg-surface-container-low border-b border-outline-variant"
                  >
                    <td className="py-[7px] px-3 align-middle">
                      <span
                        className="inline-flex items-center px-2.5 py-[2px] rounded-full text-[11px] font-semibold whitespace-nowrap"
                        style={{
                          background: c.bg,
                          color: c.text,
                          border: `1px solid ${c.border}`,
                        }}
                      >
                        {label}
                      </span>
                    </td>
                    <td className="py-[7px] px-3 align-middle text-right">
                      {(m.precision * 100).toFixed(2)}%
                    </td>
                    <td className="py-[7px] px-3 align-middle text-right">
                      {(m.recall * 100).toFixed(2)}%
                    </td>
                    <td
                      className={`py-[7px] px-3 align-middle text-right font-bold ${isBest ? "text-primary" : "text-on-surface"}`}
                    >
                      {(m.f1Score * 100).toFixed(2)}%
                    </td>
                    <td className="py-[7px] px-3 align-middle text-right text-on-surface-variant">
                      {m.count.toLocaleString()}
                    </td>
                  </tr>
                );
              })}

              {/* Macro Avg row */}
              {(() => {
                const macroP =
                  labels.reduce(
                    (s: number, l: string) => s + classMetrics[l].precision,
                    0,
                  ) / labels.length;
                const macroR =
                  labels.reduce(
                    (s: number, l: string) => s + classMetrics[l].recall,
                    0,
                  ) / labels.length;
                const macroF =
                  labels.reduce(
                    (s: number, l: string) => s + classMetrics[l].f1Score,
                    0,
                  ) / labels.length;
                return (
                  <tr className="bg-surface-container-low font-bold hover:bg-surface-container-high transition-colors">
                    <td className="py-[7px] px-3 align-middle text-on-surface-variant">
                      Macro Avg
                    </td>
                    <td className="py-[7px] px-3 align-middle text-right">
                      {(macroP * 100).toFixed(2)}%
                    </td>
                    <td className="py-[7px] px-3 align-middle text-right">
                      {(macroR * 100).toFixed(2)}%
                    </td>
                    <td className="py-[7px] px-3 align-middle text-right text-on-surface">
                      {(macroF * 100).toFixed(2)}%
                    </td>
                    <td className="py-[7px] px-3 align-middle text-right text-on-surface-variant">
                      {totalData.toLocaleString()}
                    </td>
                  </tr>
                );
              })()}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default EvaluatePaper;
