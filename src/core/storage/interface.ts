import type { Session } from "../../types/session";

type Req = Required<Session>["request"];

export type SessionPart = Pick<Session, "slug" | "meta"> & {
  request?: Partial<Pick<Req, "url" | "method">>;
};

export interface Storage {
  load(): Promise<Array<Session>>;

  remove(slug: Session["slug"]): Promise<void>;

  save(...sessions: Array<Session>): Promise<void>;

  get(slug: Session["slug"]): Promise<Session | null>;

  loaded(_: Session): boolean;
}
