import express from "@stack54/express/plugin";
import { defineConfig } from "stack54/config";
import webfontDownload from "vite-plugin-webfont-dl";

export default defineConfig({
  integrations: [express()],
  build: { minify: false },
  views: ["src/views/**/*.{entry,html}.svelte"],
  vite: {
    build: { target: "node16" },
    plugins: [webfontDownload()],
  },
});
