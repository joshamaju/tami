import bodyParser from "body-parser";
import compression from "compression";
import express, { type ErrorRequestHandler } from "express";
import methodOverride from "method-override";
import session from "express-session";

import logger from "morgan";

import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/function";

import { engine, View } from "@stack54/express/view";

import { SessionManager } from "./core/session-manager";
import { DiskStorage } from "./core/storage/disk-storage";
import { format } from "./core/utils";
import { Method } from "./types/method";
import type { SessionRequest } from "./types/session";
import { resolve } from "./utils/view";

const manager = new SessionManager(new DiskStorage());

await manager.load();

const app = express();

app.engine("svelte", engine);
app.set("view engine", "svelte");
app.set("view", View({ resolve }));

if (import.meta.env.DEV) {
  app.use(logger("dev"));
}

app.use(
  session({
    resave: false,
    secret: "keyboard cat",
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(compression());
app.use(methodOverride());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(async (_, __, next) => {
  if (manager.empty) manager.newSession();
  next();
});

app.get("/", async (req, res) => {
  const slug = req.query.session;

  let session = typeof slug === "string" ? manager.get(slug) : null;

  if (slug && !session) return res.status(404).render("404");

  session ??= manager.peek() ?? manager.newSession();

  const res_ = session.response;

  // res.setHeader(
  //   "Link",
  //   manager.sessions
  //     .filter((s) => s.slug !== slug)
  //     .map((s) => `</?session=${s.slug}>; rel="prefetch"`)
  //     .join(", ")
  // );

  return res.render("home/home", {
    session,
    sessions: manager.sessions,
    response: res_
      ? E.right({
          ...res_,
          formatted: res_ ? await format(res_) : null,
        })
      : null,
  });
});

app.post("/", async (req, res) => {
  let slug = req.query.session;

  let session = typeof slug === "string" ? manager.get(slug) : null;

  session ??= manager.newSession();

  const {
    url,
    body,
    query_key,
    query_value,
    header_key,
    header_value,
    method = Method.GET,
  } = req.body;

  const query = [] as SessionRequest["query"];

  if (query_key) {
    query_key.forEach((k: string, i: number) => {
      const key = k.toString();
      const value = query_value[i];
      if (key.trim() !== "" && value) query?.push([key, value?.toString()]);
    });
  }

  const headers = {} as Record<string, string>;

  if (header_key) {
    header_key.forEach((k: string, i: number) => {
      const key = k.toString();
      const value = header_value[i];
      if (key.trim() !== "" && value) headers[key] = value?.toString();
    });
  }

  session.update({ url, query, body, method, headers });

  const response = await session.execute();

  await manager.update(session);

  const fn = pipe(
    TE.fromEither(response),
    TE.chain(() => {
      return TE.tryCatch(async () => {
        return {
          ...session.response,
          formatted: session.response ? await format(session.response) : null,
        };
      }, E.toError);
    })
  );

  // if (E.isRight(response) && is_image(response.right)) {
  //   const res = response.right;

  //   const blob = await response.right.clone().blob();
  //   const data = Buffer.from(await blob.arrayBuffer()).toString("base64");

  //   session.update(session.request, {
  //     body: data,
  //     status: res.status,
  //     statusText: res.statusText,
  //     headers: Object.fromEntries(res.headers),
  //   });

  //   await manager.update(session);
  // }

  return res.render("home/home", {
    session,
    response: await fn(),
    sessions: manager.sessions,
  });
});

app.post("/session/delete", async (req, res) => {
  const { slug } = req.body;
  if (slug) await manager.remove(slug);
  return res.redirect("/");
});

app.post("/session/duplicate", async (req, res) => {
  const { slug } = req.body;

  const session = manager.get(slug);

  if (session) {
    const clone = await manager.clone(session);
    return res.redirect(`/?session=${clone.slug}`);
  }

  return res.redirect("/");
});

app.post("/session/new", async (_, res) => {
  const session = manager.newSession();
  return res.redirect(`/?session=${session.slug}`);
});

const errorHandler: ErrorRequestHandler = (error, _, res, next) => {
  console.log(error);
  if (res.headersSent) return next(error);
  res.status(500).render("error", { error });
};

app.use(errorHandler);

app.use(function (_, res) {
  res.status(404).render("404");
});

export default app;
