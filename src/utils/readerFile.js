import * as XLSX from "xlsx"; // Pastikan XLSX diimpor di sini jika belum global

export const readFileAndParseData = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const firstSheetName = workbook.SheetNames[0];

        if (!firstSheetName) {
          resolve({ error: "No sheets found in the workbook." });
          return;
        }

        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          blankrows: false,
          defval: "",
        });

        if (jsonData && jsonData.length > 0) {
          const potentialHeaders = jsonData[0].map((h) => String(h).trim()); // Ambil header, pastikan string, trim whitespace
          // Data dimulai dari baris kedua (index 1)
          const tableData = jsonData.slice(1);

          resolve({ headers: potentialHeaders, tableData: tableData });
        } else {
          resolve({
            error: "The uploaded file is empty.",
          });
        }
      } catch (e) {
        console.error("Error processing file content:", e);
        resolve({
          error: `Error processing file content. Ensure it's a valid Excel/CSV. Details: ${e.message}`,
        });
      }
    };

    reader.onerror = () => {
      console.error("FileReader error");
      resolve({ error: "Failed to read the file. An unknown error occurred." });
    };

    reader.readAsBinaryString(file);
  });
};
