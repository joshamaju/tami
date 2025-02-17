// @ts-check
import { fileURLToPath } from "node:url";
import express, { static as static_ } from "express";
import router from "../dist/server/index.js";

const app = express();

const build_path = fileURLToPath(new URL("../dist", import.meta.url));

const serve_build_assets = static_(build_path, {
  immutable: true,
  maxAge: "1y",
});

app.disable("x-powered-by");

app.use(serve_build_assets);

app.use(static_("static", { maxAge: "1h" }));

app.use(router);

export default app;
