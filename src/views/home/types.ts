import type { FormattedResponse } from "../../core/utils";

export type Result = {
  body: string;
  status: number;
  duration: number;
  statusText: string;
  headers: Record<string, string>;
  formatted: FormattedResponse | null;
};
