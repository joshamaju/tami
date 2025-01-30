<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import type { Config } from "./types";

  interface $$Props extends HTMLAttributes<HTMLElement>, Config {}

  export let code: $$Props["code"];
  export let language: $$Props["language"];
  export let readonly: $$Props["readonly"] = false;
</script>

<svelte:head>
  <script type="module" src="./script.ts"></script>
</svelte:head>

<postboy-editor
  {...$$restProps}
  config="{JSON.stringify({ code, readonly, language })}"
>
</postboy-editor>
