import { Session } from "../../src/core/session";
import { Storage } from "../../src/core/storage/interface";
import { Session as ISession } from "../../src/types/session";

export const data = new Map<string, ISession>([
  [
    "1",
    {
      meta: {},
      slug: "1",
      request: { url: "google.com", method: "GET" },
    },
  ],
]);

export class MemoryStorage implements Storage {
  constructor(private map: Map<string, ISession>) {}

  get data() {
    return [...this.map.values()];
  }

  get size() {
    return this.map.size;
  }

  async get(slug: Session["slug"]): Promise<ISession | null> {
    return this.map.get(slug) ?? null;
  }

  async load(): Promise<Array<ISession>> {
    return [...this.map.values()];
  }

  loaded(_: Session): boolean {
    return true;
  }

  async remove(slug: ISession["slug"]): Promise<void> {
    this.map.delete(slug);
  }

  async save(...sessions: Array<ISession>): Promise<void> {
    sessions.map((_) => this.map.set(_.slug, _));
  }
}
