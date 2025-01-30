<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  type $$Props = HTMLAttributes<HTMLDivElement>;
</script>

<svelte:head>
  <script type="module" src="./script.ts"></script>
</svelte:head>

<div {...$$props} class="line-numbers">
  <pre class="js-editor-code">
    <code class="language-javascript"></code>
  </pre>
  <textarea
    name="body"
    class="js-editor-input"
    spellcheck="false"
    autocorrect="off"
    autocapitalize="off"
    translate="no"
  ></textarea>
</div>

<style>
  div {
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr;
    column-gap: 0;
    row-gap: 0;
  }

  code {
    font-size: 1em;
    word-wrap: break-word;
  }

  pre {
    height: 100%;
    display: block;
    overflow: auto;
    line-height: 1.5;
    margin: 0 0 1.5em;
  }

  pre,
  textarea {
    tab-size: 2;
    line-height: 1.5;
    padding: 0.8125em;
    grid-area: 1/1/2/2;
    white-space: pre-wrap;
    word-break: break-all;
  }

  textarea {
    resize: none;
    font: inherit;
    height: unset;
    overflow: hidden;
    padding: 0.8125em;
    color: transparent;
    caret-color: #272727;
    background-color: transparent;
    font-family: Menlo, Monaco, "Courier New", monospace;
  }
</style>
