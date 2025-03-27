import "htmx.org";
import htmx from "htmx.org";

import { ContentType } from "../../types/content-type";
import type { Editor } from "./editor/script";
import { emitter } from "./islands/store";

type Input = HTMLInputElement;
type Select = HTMLSelectElement;

// @ts-expect-error
window.htmx = htmx;

document.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;

  if (target.classList.contains("js-toggle-side-nav")) {
    if (document.body.classList.contains("side-nav-collaped")) {
      document.body.classList.remove("side-nav-collaped");
    } else {
      document.body.classList.add("side-nav-collaped");
    }
  }

  if (target.classList.contains("js-tab")) {
    const current = target.parentElement?.querySelector("[data-active]");

    const controls = target.getAttribute("aria-controls");
    const activeControls = current?.getAttribute("aria-controls");

    current?.removeAttribute("data-active");
    target.setAttribute("data-active", "");

    if (controls) {
      const panel = document.getElementById(controls);
      panel?.removeAttribute("hidden");
    }

    if (target !== current && activeControls) {
      const panel = document.getElementById(activeControls);
      panel?.setAttribute("hidden", "");
    }
  }
});

htmx.onLoad(() => {
  const body = document.getElementById("body") as Input | null;
  const editor = document.getElementById("body-editor") as Editor | null;
  const content_type = document.getElementById("content-type") as Select | null;

  document.addEventListener("htmx:beforeSend", () => {
    document.body.setAttribute("data-submitting", "true");
  });

  document.addEventListener("htmx:afterOnLoad", () => {
    document.body.removeAttribute("data-submitting");
  });

  document.addEventListener("htmx:sendAbort", () => {
    document.body.removeAttribute("data-submitting");
  });

  content_type?.addEventListener("change", (e) => {
    const type = (e.target as Select).value;

    switch (type) {
      case ContentType.TEXT:
      case ContentType.URLENCODED:
        editor?.setAttribute("language", "text");
        break;

      case ContentType.JSON:
        editor?.setAttribute("language", "js");
        break;
    }

    emitter.emit("header_change", { key: "Content-Type", value: type });
  });

  editor?.addEventListener("editor:update", (e) => {
    const event = e as CustomEvent;
    if (body) body.value = event.detail.doc;
  });
});
