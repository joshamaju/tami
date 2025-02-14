type KeyValue = [name: string, value: string];

export type SessionRequest = {
  url?: string;
  body?: string;
  method?: string;
  query?: Array<KeyValue>;
  headers?: Record<string, string>;
};

export type SessionResponse = {
  body?: string;
  status: number;
  duration: number;
  statusText: string;
  headers?: Record<string, string>;
};

export type Session = {
  slug: string;
  request?: SessionRequest;
  response?: SessionResponse | undefined;
};
