import React from "react";
import { Alert } from "@mui/material";
import DropZone from "../../widgets/dropZone/dropZone";

const SimulationDropzonePaper = ({
  error,
  setIsLoadingUpload,
  setError,
  resetState,
  mode = "simulation",
}) => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="max-w-3xl w-full">
        {/* Alert jika ada error */}
        {error && (
          <Alert severity="error" sx={{ mb: 4 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {/* Dropzone */}
        <DropZone
          setIsLoadingUpload={setIsLoadingUpload}
          setError={setError}
          resetState={resetState}
          mode={mode}
        />
      </div>
    </div>
  );
};

export default SimulationDropzonePaper;
