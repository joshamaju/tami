import { spaceSlug } from "space-slug";
import { Session } from "./session";
import type { Storage } from "./storage/interface";

export class SessionManager {
  private _sessions = new Map<string, Session>();

  constructor(private storage: Storage) {}

  get empty() {
    return this._sessions.size <= 0;
  }

  get sessions() {
    return [...this._sessions.values()];
  }

  peek() {
    const [first] = [...this._sessions.values()];
    return first;
  }

  async newSession() {
    const slug = spaceSlug();
    const session = new Session({ slug });
    this._sessions.set(slug, session);
    await this.saveSession(session);
    return session;
  }

  async clone(session: Session) {
    const slug = spaceSlug();

    const new_session = new Session(
      { slug },
      session.request,
      session.response
    );

    this._sessions.set(slug, new_session);
    await this.saveSession(session);
    return new_session;
  }

  get(slug: string) {
    return this._sessions.get(slug);
  }

  remove(slug: string) {
    this._sessions.delete(slug);
    return this.storage.remove(slug);
  }

  async update(session: Session) {
    this._sessions.set(session.slug, session);
    await this.saveSession(session);
  }

  async saveSession(session: Session) {
    const data = await session.toJson();
    await this.storage.save(data);
  }

  async save() {
    const sessions = [...this._sessions.values()].map((_) => _.toJson());
    return this.storage.save(...(await Promise.all(sessions)));
  }

  async load() {
    const contents = await this.storage.load();

    contents.forEach(({ slug, ..._ }) => {
      this._sessions.set(slug, new Session({ slug }, _.request, _.response));
    });
  }
}
