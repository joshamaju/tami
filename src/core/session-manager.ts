import { spaceSlug } from "space-slug";
import { Session } from "./session";
import type { Session as ISession } from "../types/session";
import type { Storage } from "./storage/interface";

export class SessionManager {
  private mapping = new Map<string, Session>();

  constructor(private storage: Storage) {}

  get empty() {
    return this.mapping.size <= 0;
  }

  get sessions() {
    return [...this.mapping.values()];
  }

  peek() {
    const first = [...this.mapping.values()][0];
    if (first) return this.get(first.slug);
    return null;
  }

  async newSession() {
    const slug = spaceSlug();
    const session = new Session(slug);
    this.mapping.set(slug, session);
    await this.save(session);
    return session;
  }

  async clone(_: Session) {
    const slug = spaceSlug();

    let data: ISession | null = null;

    if (!this.storage.loaded(_)) {
      data = await this.storage.get(_.slug);
    }

    const meta = data?.meta ?? _.meta;
    const req = data?.request ?? _.request;
    const res = data?.response ?? _.response;

    const session = new Session(slug, req, res, meta);

    this.mapping.set(slug, session);

    await this.save(session);

    return session;
  }

  async get(slug: string) {
    let session = this.mapping.get(slug);

    if (session && !this.storage.loaded(session)) {
      const _ = await this.storage.get(slug);
      session = new Session(slug, _?.request, _?.response, _?.meta);
      this.mapping.set(slug, session);
    }

    return session;
  }

  remove(slug: string) {
    this.mapping.delete(slug);
    return this.storage.remove(slug);
  }

  async update(session: Session) {
    this.mapping.set(session.slug, session);
    await this.save(session);
  }

  async save(session: Session) {
    await this.storage.save(session.toJson());
  }

  async save_all() {
    const sessions = this.mapping.values().map((_) => _.toJson());
    await this.storage.save(...sessions);
  }

  async load() {
    const contents = await this.storage.load();

    contents.forEach(({ slug, ..._ }) => {
      const session = new Session(slug, _.request, _.response, _.meta);
      this.mapping.set(slug, session);
    });
  }
}
