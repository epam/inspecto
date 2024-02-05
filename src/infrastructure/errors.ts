export enum ERRORS {
  WRONG_FILE_FORMAT,
}

export const ERROR_MESSAGES: Record<ERRORS, string> = {
  [ERRORS.WRONG_FILE_FORMAT]: "File format should be .mol or .ket",
} as const;
