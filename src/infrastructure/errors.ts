export enum ERRORS {
  WRONG_FILE_FORMAT,
  FILE_READING_FAILURE,
  UNKNOWN_ERROR,
}

export const ERROR_MESSAGES: Record<ERRORS, string> = {
  [ERRORS.WRONG_FILE_FORMAT]: "File format should be .mol",
  [ERRORS.FILE_READING_FAILURE]: "Failed to read file",
  [ERRORS.UNKNOWN_ERROR]: "Error is occured: ",
} as const;
