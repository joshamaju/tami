import "htmx.org";
import htmx from "htmx.org";

type Input = HTMLInputElement;
type Select = HTMLSelectElement;

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
  const editor = document.getElementById("body-editor");
  const body = document.getElementById("body") as Input | null;

  const content_type = document.querySelector(
    'select[name="content-type"]'
  ) as Select | null;

  const add_query = document.querySelector(".js-add-query");
  const add_header = document.querySelector(".js-add-header");

  document.addEventListener("htmx:beforeSend", () => {
    document.body.setAttribute("data-submitting", "true");
  });

  document.addEventListener("htmx:afterOnLoad", () => {
    document.body.removeAttribute("data-submitting");
  });

  document.addEventListener("htmx:sendAbort", () => {
    document.body.removeAttribute("data-submitting");
  });

  add_query?.addEventListener("click", () => {
    // clone an existing search query parameter row
    const row = document.querySelector(".js-query-row");

    if (row) {
      const id = crypto.randomUUID();

      const clone = row.cloneNode(true) as HTMLElement;
      const parent = row.parentElement;

      const remove = clone.querySelector("button[data-remove]");
      remove?.setAttribute("data-key", id);
      remove?.removeAttribute("disabled");
      remove?.removeAttribute("hidden");

      const fields = clone.querySelectorAll("input");
      fields.forEach((field) => (field.value = ""));

      clone.id = id;

      parent?.appendChild(clone);
    }
  });

  add_header?.addEventListener("click", () => {
    make_header("", "");
  });

  content_type?.addEventListener("change", (e) => {
    const id = "request-header-content-type";
    const type = (e.target as Select).value;

    document.getElementById(id)?.remove();

    if (type.trim() !== "") {
      const el = make_header("Content-Type", type);
      if (el) el.id = id;
    }
  });

  editor?.addEventListener("editor:update", (e) => {
    const event = e as CustomEvent;
    if (body) body.value = event.detail.doc;
  });
});

function make_header(key: string, value: string) {
  const row = document.querySelector(".js-header-row");

  if (row) {
    const parent = row.parentElement;
    const clone = row.cloneNode(true) as HTMLElement;

    const id = crypto.randomUUID();

    const remove = clone.querySelector("button[data-remove]");
    remove?.setAttribute("data-key", id);
    remove?.removeAttribute("disabled");
    remove?.removeAttribute("hidden");

    const k = clone?.querySelector("input[name='header_key']") as Input | null;

    const v = clone?.querySelector(
      "input[name='header_value']"
    ) as Input | null;

    if (k) k.value = key;
    if (v) v.value = value;

    clone.id = id;

    parent?.appendChild(clone);

    return clone;
  }
}
