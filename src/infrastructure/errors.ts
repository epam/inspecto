export enum ERRORS {
  UNKNOWN_ERROR,
}

export const ERROR_MESSAGES: Record<ERRORS, string> = {
  [ERRORS.UNKNOWN_ERROR]: "Error is occured: ",
} as const;
