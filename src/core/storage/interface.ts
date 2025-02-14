import type { Session } from "../../types/session";

type Req = Required<Session>["request"];

export type SessionPart = Pick<Session, "slug"> & {
  request?: Partial<Pick<Req, "url" | "method">>;
};

export interface Storage {
  load(): Promise<Array<SessionPart>>;

  remove(slug: Session["slug"]): Promise<void>;

  save(...sessions: Array<Session>): Promise<void>;

  loadOne(slug: Session["slug"]): Promise<Session | null>;
}
