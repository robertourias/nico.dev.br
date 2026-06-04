export type ErrorType = 'SyntaxError' | 'RuntimeError' | 'LogicError' | 'StyleWarning';

export interface CodeError {
  line: number | null;
  type: ErrorType;
  message: string;
  fix: string;
}

export interface DebugResult {
  language: string;
  correctedCode: string;
  errors: CodeError[];
}

export interface DebugApiError {
  error: 'CODE_TOO_LONG' | 'GEMINI_PARSE_ERROR' | 'GEMINI_API_ERROR' | 'QUOTA_EXCEEDED' | 'MISSING_API_KEY' | 'UNKNOWN_ERROR';
}
