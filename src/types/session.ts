type KeyValue = [name: string, value: string];

export type IRequest = {
  url: string;
  body: string;
  method: string;
  query: Array<KeyValue>;
  headers: Record<string, string>;
};

export type Request = Partial<IRequest>;

export type Response = {
  body?: string;
  status: number;
  duration: number;
  statusText: string;
  headers?: Record<string, string>;
};

export type Session = {
  slug: string;
  request?: Request;
  meta: Record<string, unknown>;
  response?: Response | undefined;
};
