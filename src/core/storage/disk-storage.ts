import fs from "fs-extra";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { Session } from "../../types/session";
import type { Storage } from "./interface";

export class DiskStorage implements Storage {
  private root = fileURLToPath(
    new URL(
      import.meta.env.DEV ? "../../../manager" : "./manager",
      import.meta.url
    )
  );

  remove(slug: string) {
    return fs.remove(join(this.root, slug));
  }

  async saveOne(data: Session) {
    await fs.writeJSON(join(this.root, data.slug), data);
  }

  async save(...sessions: Array<Session>) {
    await Promise.all(sessions.map((_) => this.saveOne(_)));
  }

  async load() {
    await fs.ensureDir(this.root);

    const files = await fs.readdir(this.root);

    const contents = await Promise.all(
      files.map((file) => fs.readFile(join(this.root, file), "utf-8"))
    );

    return contents
      .map((content) => {
        try {
          return JSON.parse(content);
        } catch (error) {
          return null;
        }
      })
      .filter(Boolean);
  }
}
