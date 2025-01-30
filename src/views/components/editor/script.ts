import * as babel from "prettier/plugins/babel.js";
import * as estree from "prettier/plugins/estree.js";
import * as prettier from "prettier/standalone";
import Prism from "prismjs";

import "prismjs/plugins/line-numbers/prism-line-numbers";

const pre = document.querySelector(".js-editor-code code");
const input = document.querySelector(".js-editor-input");

input?.addEventListener("input", async () => {
  if (pre) {
    let code = (input as HTMLTextAreaElement).value;

    try {
      code = await prettier.format(code, {
        parser: "json",
        plugins: [estree, babel],
      });
    } catch (error) {}

    pre.textContent = code;
    Prism.highlightElement(pre);
  }
});
