import React from "react";

export const validationDataChecks = (result, setError, resetState) => {
  const { headers: potentialHeaders, tableData } = result;
  const validHeaders = potentialHeaders.filter((h) => h !== "");
  const includeErrorReset = true;

  // Check Header apakah valid atau ngga
  if (validHeaders.length > 1) {
    // Jika ada lebih dari satu header(atribut)
    setError(
      "Validation Error: Please upload a file with only one data column (attribute)."
    );
    resetState(!includeErrorReset);
    return null;
  } else if (validHeaders.length === 1) {
    if (potentialHeaders[0] !== "message") {
      setError("Validation Error: File must contain a 'message' column.");
      resetState(!includeErrorReset);
      return null;
    }
    return {
      result,
    };
  }

  if (tableData.length === 0) {
    setError("Validation Error: File must contain at least one data row.");
    resetState(!includeErrorReset);
    return null;
  }
};
