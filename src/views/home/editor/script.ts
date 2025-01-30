import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { EditorState } from "@codemirror/state";
import { basicSetup, EditorView } from "codemirror";
import type { Config } from "./types";

class Editor extends HTMLElement {
  #editor: EditorView | null = null;

  disconnectedCallback() {
    this.#editor?.destroy();
  }

  connectedCallback() {
    const config = this.getAttribute("config");
    const data: Config = config ? JSON.parse(config) : null;

    const lang =
      data.language == "js"
        ? javascript()
        : data.language == "html"
          ? html()
          : null;

    const extensions = [basicSetup];

    if (lang) {
      extensions.push(lang);
    }

    this.#editor = new EditorView({
      parent: this,
      doc: data?.code ?? "",
      extensions: [
        ...extensions,
        EditorView.updateListener.of((update) => {
          const doc = update.state.doc.toString();

          const event = new CustomEvent("editor:update", {
            detail: { doc },
            bubbles: true,
          });

          this.dispatchEvent(event);
        }),
        ...(data?.readonly
          ? [
              EditorState.readOnly.of(true),
              EditorView.editable.of(false),
              EditorView.contentAttributes.of({ tabindex: "0" }),
            ]
          : []),
      ],
    });
  }
}

customElements.define("postboy-editor", Editor);
