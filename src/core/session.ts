import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import { Method } from "../types/method";
import type {
  Session as ISession,
  SessionRequest,
  SessionResponse,
} from "../types/session";
import { is_image } from "./utils";

export class Session {
  constructor(
    private config: { slug: string },
    private _request = {} as SessionRequest,
    private _response?: SessionResponse
  ) {
    this._request.headers ??= {};
    this._request.headers["Accept"] ??= "*/*";
  }

  get slug() {
    return this.config.slug;
  }

  get request() {
    return this._request;
  }

  get response() {
    return this._response;
  }

  clone() {
    return new Session(this.config, this._request, this._response);
  }

  update(request: SessionRequest, response?: SessionResponse) {
    this._request = request;
    this._response = response;
  }

  async execute() {
    const { query, headers, method } = this._request!;

    const url = new URL(this._request?.url);
    const search = new URLSearchParams(query);
    url.search = search.toString();

    // if (url.protocol !== "http:" && url.protocol !== "https:") {
    //   url.href = "http://" + url.href;
    // }

    const body = method == Method.GET ? undefined : this._request.body;

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

      this._response = {
        body,
        duration,
        status: clone.status,
        statusText: clone.statusText,
        headers: Object.fromEntries(clone.headers),
      };
    }

    return response;
  }

  toJson(): ISession {
    return {
      slug: this.config.slug,
      request: this._request,
      response: this._response,
    };
  }
}
