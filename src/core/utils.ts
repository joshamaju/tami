import { ContentType } from "@mjackson/headers";
import * as prettier from "prettier";
import type * as Session from "../types/session";

export type FormattedResponse =
  | { type: "image"; content: string }
  | { type: "json" | "xml"; formatted: string };

const JSON_TYPES = ["application/json", "application/problem+json"];

const IMAGE_TYPES = ["image/png", "image/jpeg", "image/gif", "image/svg+xml"];

const XML_TYPES = ["text/html"];

export function media_type(response: Response | Session.Response) {
  const content_type =
    response instanceof Response
      ? (response.headers.get("content-type") ?? undefined)
      : response.headers?.["content-type"];

  return new ContentType(content_type).mediaType;
}

export function is_image(response: Response | Session.Response) {
  const contentType = media_type(response);
  if (contentType) return IMAGE_TYPES.includes(contentType);
  return false;
}

// export async function formatResponse(
//   response: Response
// ): Promise<FormattedResponse | null> {
//   if (!response.body) return null;

//   const content_type =
//     response.headers.get("Content-Type") ??
//     response.headers.get("content-type");

//   const headers = Object.fromEntries(response.headers);
//   const contentType = new ContentType(content_type ?? undefined);

//   const clone = response.clone();

//   if (contentType.mediaType && IMAGE_TYPES.includes(contentType.mediaType)) {
//     const blob = await clone.blob();
//     const data = Buffer.from(await blob.arrayBuffer()).toString("base64");
//     return format({ ...response, body: data, headers });
//   }

//   return format({ ...response, headers, body: await clone.text() });
// }

export async function format(
  response: Session.Response
): Promise<FormattedResponse | null> {
  if (!response.body) return null;

  const content_type =
    response.headers?.["Content-Type"] ?? response.headers?.["content-type"];

  const contentType = new ContentType(content_type);

  const body = response.body;

  if (contentType.mediaType) {
    const xml = XML_TYPES.includes(contentType.mediaType);
    const json = JSON_TYPES.includes(contentType.mediaType);

    if (xml || json) {
      const parser = json ? "json" : xml ? "html" : "acorn";
      const formatted = await prettier.format(body, { parser });
      return { formatted, type: json ? "json" : xml ? "xml" : "json" };
    }

    if (IMAGE_TYPES.includes(contentType.mediaType)) {
      const content = `data:${contentType.mediaType};base64,` + body;
      return { content, type: "image" };
    }
  }

  return null;
}

export function display_time(time: number): string {
  // display: {X}ms
  if (time < 1000) {
    return `${time} ms`;
  }

  time = time / 1000;

  // display: {X}s
  if (time < 60) {
    return `${time.toFixed(2)} s`;
  }

  const mins = parseInt((time / 60).toString());
  const seconds = time % 60;

  // display: {X}m {Y}s
  return `${mins} m${seconds < 1 ? "" : ` ${seconds.toFixed(0)} s`}`;
}
