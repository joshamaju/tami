import bodyParser from "body-parser";
import compression from "compression";
import express, { type ErrorRequestHandler } from "express";
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
import { resolve } from "./utils/view";
import { version_check } from "./core/version";
import { VERSION } from "../version";

const latest_version = version_check();

const manager = new SessionManager(new DiskStorage());

console.log("📀 loading local history");

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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(async (_, res, next) => {
  const latest = await latest_version;
  res.locals.version = { current: VERSION, latest };
  next();
});

app.get("/", async (req, res) => {
  const slug = req.query.session;

  let session = typeof slug === "string" ? await manager.get(slug) : null;

  if (slug && !session) {
    return res.status(404).render("404");
  }

  session ??= await manager.peek();
  session ??= await manager.newSession();

  const resp = session.response;

  const p = req.query.preview;
  const preview = typeof p == "string" && p == "1";

  return res.render("home/home", {
    session,
    preview,
    sessions: manager.sessions,
    response: resp ? E.right({ ...resp, formatted: await format(resp) }) : null,
  });
});

app.post("/", async (req, res) => {
  let slug = req.query.session;

  let session = typeof slug === "string" ? await manager.get(slug) : null;

  session ??= await manager.newSession();

  const { url, body, method = Method.GET } = req.body;

  type KV = Record<"key" | "value", string>;

  const _headers = req.body.header as Array<KV> | undefined;

  let headers = {} as Record<string, string>;

  if (_headers) {
    headers = Object.fromEntries(
      _headers
        .filter(({ key }) => key.trim() !== "")
        .map(({ key, value }) => [key, value])
    );
  }

  session.update({ url, body, method, headers });

  const response = await session.execute();

  await manager.update(session);

  const fn = pipe(
    TE.fromEither(response),
    TE.chain(() => {
      const res = session.response;
      return TE.tryCatch(async () => {
        return { ...res, formatted: res ? await format(res) : null };
      }, E.toError);
    })
  );

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

  const session = await manager.get(slug);

  if (session) {
    const clone = await manager.clone(session);
    return res.redirect(`/?session=${clone.slug}`);
  }

  return res.redirect("/");
});

app.post("/session/new", async (_, res) => {
  const session = await manager.newSession();
  return res.redirect(`/?session=${session.slug}`);
});

// app.get("/version-check", async (req, res) => {
//   const goto = typeof req.query.go == "string" ? req.query.go : null;
//   const latest = await version_check();
//   app.locals.version = { current: "0.0.0", latest };
//   return res.redirect(goto ?? "/");
// });

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
