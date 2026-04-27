import { convertBytesToReadableSize } from "./convertBytesToReadableSize";

export const validationFileChecks = (
  file,
  MAX_FILE_SIZE_BYTES,
  ALLOWED_EXTENSIONS
) => {
  if (!file) {
    return "No file provided for validation.";
  }

  const fileExtension = file.name
    .substring(file.name.lastIndexOf("."))
    .toLowerCase();

  if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
    return `Invalid file type. Please upload ${ALLOWED_EXTENSIONS.join(", ")}.`;
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `File is too large. Maximum size is ${convertBytesToReadableSize(
      MAX_FILE_SIZE_BYTES
    )}.`;
  }

  return null;
};
