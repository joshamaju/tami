import fs from "fs-extra";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { Session } from "../../types/session";
import type { SessionPart, Storage } from "./interface";

export class DiskStorage implements Storage {
  private root = fileURLToPath(
    new URL(
      import.meta.env.DEV ? "../../../manager" : "./manager",
      import.meta.url
    )
  );

  private meta = join(this.root, "metadata.json");

  private async getMeta(): Promise<SessionPart[]> {
    try {
      const meta = await fs.readJSON(this.meta);
      return meta;
    } catch (error) {
      return [];
    }
  }

  private async saveMeta(data: Array<SessionPart>) {
    await fs.writeJSON(this.meta, data);
  }

  async remove(slug: string) {
    const meta = await this.getMeta();
    await this.saveMeta(meta.filter((_) => _.slug == slug));
    return fs.remove(join(this.root, slug));
  }

  async saveOne(data: Session) {
    await fs.writeJSON(join(this.root, data.slug), data);
  }

  async save(...sessions: Array<Session>) {
    await Promise.all([
      ...sessions.map((_) => this.saveOne(_)),
      this.getMeta().then((_) => {
        const meta = [
          ..._,
          ...sessions.map((_) => ({
            slug: _.slug,
            request: { url: _.request?.url, method: _.request?.method },
          })),
        ];

        return this.saveMeta(
          Object.values(
            Object.fromEntries(meta.map((_) => [_.slug, _] as const))
          )
        );
      }),
    ]);
  }

  async loadOne(slug: Session["slug"]) {
    try {
      const data = await fs.readJSON(join(this.root, slug));
      return data;
    } catch (error) {
      return null;
    }
  }

  async load(): Promise<Array<SessionPart>> {
    await fs.ensureDir(this.root);
    return this.getMeta();
  }
}
