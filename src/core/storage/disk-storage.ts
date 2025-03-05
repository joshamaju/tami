import fs from "fs-extra";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { Session } from "../../types/session";
import type { SessionPart, Storage } from "./interface";

enum LoadState {
  Full = "full",
  Partial = "partial",
}

function clean_meta(metadata: Session["meta"]) {
  const { load_state, ...meta } = metadata;
  return meta;
}

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

  loaded(_: Session): boolean {
    return _.meta.load_state == LoadState.Full;
  }

  async remove(slug: string) {
    const meta = await this.getMeta();
    await this.saveMeta(meta.filter((_) => _.slug == slug));
    return fs.remove(join(this.root, slug));
  }

  async saveOne(data: Session) {
    const { meta, ...session } = data;

    await fs.writeJSON(join(this.root, data.slug), {
      ...session,
      meta: clean_meta(meta),
    });
  }

  async save(...sessions: Array<Session>) {
    await Promise.all([
      ...sessions.map((_) => this.saveOne(_)),
      this.getMeta().then((_) => {
        const meta = [
          ..._,
          ...sessions.map((_) => {
            return {
              slug: _.slug,
              meta: clean_meta(_.meta),
              request: { url: _.request?.url, method: _.request?.method },
            };
          }),
        ];

        return this.saveMeta(
          Object.values(
            Object.fromEntries(meta.map((_) => [_.slug, _] as const))
          )
        );
      }),
    ]);
  }

  async get(slug: Session["slug"]) {
    try {
      const { meta, ...data } = await fs.readJSON(join(this.root, slug));
      return { ...data, meta: { ...meta, load_state: LoadState.Full } };
    } catch (error) {
      return null;
    }
  }

  async load(): Promise<Array<Session>> {
    const meta = { load_state: LoadState.Partial };

    await fs.ensureDir(this.root);
    const metadata = await this.getMeta();

    return metadata.map((_) => ({
      ..._,
      response: undefined,
      meta: { ..._.meta, ...meta },
    }));
  }
}
