export enum ERRORS {
  WRONG_FILE_FORMAT,
  UNKNOWN_ERROR,
}

export const ERROR_MESSAGES: Record<ERRORS, string> = {
  [ERRORS.WRONG_FILE_FORMAT]: "File format should be .mol",
  [ERRORS.UNKNOWN_ERROR]: "Error is occured: ",
} as const;
