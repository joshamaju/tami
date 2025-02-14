import { spaceSlug } from "space-slug";
import { Session } from "./session";
import type { Storage } from "./storage/interface";

export class SessionManager {
  private _sessions = new Map<string, { loaded: boolean; session: Session }>();

  constructor(private storage: Storage) {}

  get empty() {
    return this._sessions.size <= 0;
  }

  get sessions() {
    return [...this._sessions.values()];
  }

  peek() {
    const [first] = [...this._sessions.values()];
    return first?.session;
  }

  async newSession() {
    const slug = spaceSlug();
    const session = new Session({ slug });
    this._sessions.set(slug, { loaded: true, session });
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

    const old_session = this._sessions.get(session.slug);

    this._sessions.set(slug, {
      session: new_session,
      loaded: old_session?.loaded ?? false,
    });

    await this.saveSession(session);

    return new_session;
  }

  async get(slug: string) {
    let item = this._sessions.get(slug);
    let session = item?.session;

    if (item && !item.loaded) {
      const _ = await this.storage.loadOne(slug);
      session = new Session({ slug }, _?.request, _?.response);
      this._sessions.set(slug, { loaded: true, session });
    }

    return session;
  }

  remove(slug: string) {
    this._sessions.delete(slug);
    return this.storage.remove(slug);
  }

  async update(session: Session) {
    const old = this._sessions.get(session.slug);
    this._sessions.set(session.slug, { loaded: old?.loaded ?? false, session });
    await this.saveSession(session);
  }

  async saveSession(session: Session) {
    const data = session.toJson();
    await this.storage.save(data);
  }

  async save() {
    const sessions = [...this._sessions.values()].map((_) =>
      _.session.toJson()
    );
    return this.storage.save(...(await Promise.all(sessions)));
  }

  async load() {
    const contents = await this.storage.load();

    contents.forEach(({ slug, ..._ }) => {
      this._sessions.set(slug, {
        loaded: false,
        session: new Session({ slug }, _.request),
      });
    });
  }
}
