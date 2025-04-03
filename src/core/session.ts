import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import { Method } from "../types/method";
import type * as S from "../types/session";
import { is_image } from "./utils";

export class Session {
  constructor(
    public slug: string,
    public request?: S.Request,
    public response?: S.Response,
    public meta: S.Session["meta"] = {}
  ) {
    this.request ??= {};
    this.request.headers ??= {};
    this.request.headers["Accept"] ??= "*/*";
  }

  clone() {
    return new Session(this.slug, this.request, this.response);
  }

  update(request: S.Request, response?: S.Response) {
    this.request = request;
    this.response = response;
  }

  async execute() {
    if (!this.request?.url) {
      return E.left(new Error("Invalid url"));
    }

    const { url, headers, method } = this.request;

    const body = method == Method.GET ? undefined : this.request.body;

    const config = { body, method, headers };

    const start = performance.now();
    const response = await TE.tryCatch(() => fetch(url, config), E.toError)();
    const duration = performance.now() - start;

    if (E.isRight(response)) {
      const clone = response.right.clone();

      let body: string;

      if (is_image(clone)) {
        const blob = await clone.blob();
        body = Buffer.from(await blob.arrayBuffer()).toString("base64");
      } else {
        body = await clone.text();
      }

      this.response = {
        body,
        duration,
        status: clone.status,
        statusText: clone.statusText,
        headers: Object.fromEntries(clone.headers),
      };
    }

    return response;
  }

  toJson(): S.Session {
    return {
      slug: this.slug,
      meta: this.meta,
      request: this.request,
      response: this.response,
    };
  }
}
