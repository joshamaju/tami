// @ts-check

import express, { static as static_ } from "express";
import router from "../dist/server/index.js";

const app = express();

const serve_build_assets = static_("./dist", {
  immutable: true,
  maxAge: "1y",
});

app.disable("x-powered-by");

app.use(serve_build_assets);

app.use(static_("static", { maxAge: "1h" }));

app.use(router);

export default app;
