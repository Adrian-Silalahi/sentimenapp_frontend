import "./loadingSpinner.scss";

const LoadingSpinner = () => {
  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <div className="spinner"></div>
        <p>Processing Data...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
