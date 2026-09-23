export type GolestanXmlSerializationMode = 'cdata' | 'escaped';

export interface GolestanReportRequest {
  login: string;
  pass: string;
  sec: string;
  pub: string;
  pri: string;
  mor: string;
  iFID: number;
}

export interface GolestanCallOptions {
  xmlMode?: GolestanXmlSerializationMode;
  timeoutMs?: number;
}

export interface GolestanSerializedAxiosError {
  name?: string;
  message: string;
  code?: string;
  status?: number;
  method?: string;
  url?: string;
  responseHeaders?: Record<string, string | string[] | undefined>;
  responseData?: string;
}

export interface GolestanCallDiagnostics {
  url: string;
  soapAction: string;
  xmlMode: GolestanXmlSerializationMode;
  durationMs: number;
  status?: number;
  maskedPayload: Omit<GolestanReportRequest, 'pass' | 'sec'> & {
    pass: string;
    sec: string;
  };
  requestBody: string;
  responseBody?: string;
  responseHeaders?: Record<string, string | string[] | undefined>;
  error?: GolestanSerializedAxiosError;
}

export interface GolestanCallResult {
  responseBody: string;
  diagnostics: GolestanCallDiagnostics;
}

export type GolestanClientErrorKind =
  | 'timeout'
  | 'network'
  | 'http'
  | 'unknown';

export class GolestanClientError extends Error {
  constructor(
    public readonly kind: GolestanClientErrorKind,
    public readonly diagnostics: GolestanCallDiagnostics,
    message?: string,
  ) {
    super(message ?? `Golestan client error: ${kind}`);
    this.name = 'GolestanClientError';
  }
}
