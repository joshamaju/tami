#!/usr/bin/env node

// @ts-check

import open from "open";
import getPort from "get-port";
import server from "./server.js";

(async function () {
  const port = await getPort({ port: 3000 });

  const handle = server.listen(port, () => {
    const url = `http://localhost:${port}`;
    console.log(`✅ Ready: ${url}`);
    console.log("opening browser");
    open(url);
  });

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  function shutdown() {
    console.log("shutting down...");
    handle.close(() => {
      console.log("stopped");
      process.exit(0);
    });
  }
})();
