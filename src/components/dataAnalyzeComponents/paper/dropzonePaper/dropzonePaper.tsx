import React from "react";
import { Alert } from "@mui/material";
import DropZone from "../../widgets/dropZone/dropZone";

// Define the interface for the component's props
interface DropzonePaperProps {
  error: string;
  setIsLoadingUpload: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  resetState: (errorReset: boolean) => void | null;
}

const DropzonePaper: React.FC<DropzonePaperProps> = ({
  error,
  setIsLoadingUpload,
  setError,
  resetState,
}) => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="max-w-3xl w-full">
        {/* Alert if there is an error */}
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
          mode="analysis"
        />
      </div>
    </div>
  );
};

export default DropzonePaper;
