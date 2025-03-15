/**
 * Why does this exists
 *
 * ## Use case
 * The app uses a key/value table with inputs for both. For example:
 * - adding request headers, header name, and header value
 * - adding search parameters, search parameter key and value
 * - existing headers or parameters get rendered on initial load
 * - the user can add new key/value headers, or remove existing ones
 *
 * This exists to enabled dynamic form item creation for complex forms i.e
 *
 * ```html
 * <input name="headers[0][key]" />
 * <input name="headers[0][value]" />
 * ```
 *
 * Why not use Alpine.js or Svelte reactivity on the client?
 *
 * > The entire app works without client side Javascript. Which determines and guides the approach I take
 * and the tools/libraries I use.
 *
 * ### Svelte
 * I'll have to make the entire app reactive because the body content type picker interacts
 * with the headers table, which complicates the entire app given I also rely on HTMX.
 *
 * ### Alpine.js
 * Alpine `for loop` cannot work with existing content i.e server rendered list which means
 * I can't render the page on the server with those items present.
 */

export class KeyValue extends HTMLElement {
  static TAG = "key-value-fieldset";

  connectedCallback() {
    const items = this.querySelectorAll("[data-item]");
    const trigger = this.querySelector("[data-trigger='new']");
    trigger?.addEventListener("click", this.#add_new);

    for (const item of items) {
      const trigger = item.querySelector('[data-trigger="remove"]');

      const on_remove = () => {
        trigger?.removeEventListener("click", on_remove);
        item.remove();
        this.#on_remove();
      };

      trigger?.addEventListener("click", on_remove);
    }
  }

  disconnectedCallback() {
    const trigger = this.querySelector("[data-trigger='new']");
    trigger?.removeEventListener("click", this.#add_new);
  }

  #add_new = () => {
    this.new();
  };

  #align() {
    const items = this.querySelectorAll("[data-item]");

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const inputs = item?.querySelectorAll("input");

      if (inputs) {
        for (const input of inputs) {
          const pattern = input.dataset.name;

          if (pattern) {
            input.name = pattern.replaceAll("{index}", i.toString());
          }
        }
      }
    }

    this.setAttribute("index", (items.length - 1).toString());
  }

  #on_remove() {
    this.#align();

    const index = this.getAttribute("index");

    const i = index ? parseFloat(index) : null;

    const _index = i !== null ? i - 1 : 0;

    this.setAttribute("index", _index.toString());
  }

  new() {
    this.#align();

    const index = this.getAttribute("index");
    const template = this.querySelector("template");
    const content = this.querySelector("[data-content]");

    const i = index ? parseFloat(index) : null;
    const clone = template?.content?.cloneNode(true);

    const node = clone?.childNodes[0] as HTMLElement | undefined;

    if (!node) return null;

    const inputs = node.querySelectorAll("input");

    const trigger = node.querySelector('[data-trigger="remove"]');

    const on_remove = () => {
      trigger?.removeEventListener("click", on_remove);
      node.remove();
      this.#on_remove();
    };

    trigger?.addEventListener("click", on_remove);

    const _index = (i !== null ? i + 1 : 0).toString();

    for (const input of inputs) {
      const pattern = input.dataset.name;
      if (pattern) input.name = pattern.replaceAll("{index}", _index);
    }

    this.setAttribute("index", _index);

    content?.appendChild(node);

    return node;
  }
}
