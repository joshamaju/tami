import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import { Compartment, EditorState } from "@codemirror/state";
import { basicSetup, EditorView } from "codemirror";
import type { Config } from "./types";

export class Editor extends HTMLElement {
  #editor: EditorView | null = null;

  #readonly = new Compartment();
  #language = new Compartment();

  static observedAttributes = ["code", "readonly", "language"];

  disconnectedCallback() {
    this.#editor?.destroy();
  }

  attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string | null
  ) {
    const editor = this.#editor;

    if (editor && oldValue !== newValue) {
      if (name == "readonly") {
        const readonly = newValue == null ? false : true;

        editor.dispatch({
          effects: this.#readonly.reconfigure(
            readonly
              ? [
                  EditorState.readOnly.of(true),
                  EditorView.editable.of(false),
                  EditorView.contentAttributes.of({ tabindex: "0" }),
                ]
              : []
          ),
        });
      }

      if (name == "language") {
        const lang =
          newValue == "js" ? javascript() : newValue == "html" ? html() : [];

        if (lang) {
          editor.dispatch({ effects: this.#language.reconfigure(lang) });
        }
      }

      if (name == "code" && newValue !== null) {
        this.code = newValue;
      }
    }
  }

  get code() {
    return this.#editor?.state.doc.toString() ?? "";
  }

  set code(code: string) {
    const editor = this.#editor;

    if (editor) {
      const to = editor.state.doc.length;

      const trnx = editor.state.update({
        changes: { to, from: 0, insert: code },
      });

      editor.dispatch(trnx);
    }
  }

  connectedCallback() {
    const config = this.getAttribute("config");
    const data: Config = config ? JSON.parse(config) : null;

    const code = this.getAttribute("code") ?? data.code ?? "";
    const readonly = this.getAttribute("readonly") ?? data.readonly;
    const language = this.getAttribute("language") ?? data.language;

    const lang =
      language == "js" ? javascript() : language == "html" ? html() : null;

    // const lang =
    //   data.language == "js"
    //     ? javascript()
    //     : data.language == "html"
    //       ? html()
    //       : null;

    const extensions = [basicSetup];

    if (lang) {
      extensions.push(this.#language.of(lang));
    }

    this.#editor = new EditorView({
      doc: code,
      parent: this,
      // doc: data?.code ?? "",
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
        this.#readonly.of(
          readonly
            ? [
                EditorState.readOnly.of(true),
                EditorView.editable.of(false),
                EditorView.contentAttributes.of({ tabindex: "0" }),
              ]
            : []
        ),
      ],
    });
  }

  // getExtensions({ readonly = false, language }: Partial<Config>) {
  //   const lang =
  //     language == "js" ? javascript() : language == "html" ? html() : null;

  //   const extensions = [basicSetup];

  //   if (lang) {
  //     extensions.push(lang);
  //   }

  //   return [
  //     ...extensions,
  //     EditorView.updateListener.of((update) => {
  //       const doc = update.state.doc.toString();

  //       const event = new CustomEvent("editor:update", {
  //         detail: { doc },
  //         bubbles: true,
  //       });

  //       this.dispatchEvent(event);
  //     }),
  //     EditorState.readOnly.of(readonly),
  //     EditorView.editable.of(!readonly),
  //     // EditorView.contentAttributes.of({ tabindex: "0" }),
  //   ];
  // }
}

customElements.define("postboy-editor", Editor);
