export enum ERRORS {
  UNKNOWN_ERROR,
  RULES_ARE_REQUIRED_PROPERTY,
}

export const ERROR_MESSAGES: Record<ERRORS, string> = {
  [ERRORS.UNKNOWN_ERROR]: "Error is occured: ",
  [ERRORS.RULES_ARE_REQUIRED_PROPERTY]: "Rules are reuired for this method",
} as const;
