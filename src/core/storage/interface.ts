import type { Session } from "../../types/session";

export interface Storage {
  remove(slug: Session["slug"]): Promise<void>;

  save(...sessions: Array<Session>): Promise<void>;

  load(): Promise<Array<Session>>;
}
