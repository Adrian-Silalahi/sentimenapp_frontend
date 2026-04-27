// Helper untuk memastikan input array 2 dimensi
export const getTexts2D = (input) => {
  if (input && Array.isArray(input.tableData)) {
    return input.tableData;
  }
  if (Array.isArray(input) && Array.isArray(input[0])) {
    return input;
  }
  if (Array.isArray(input)) {
    return input.map((item) => [item]);
  }
  return [];
};
