<script lang="ts">
  import { onMount } from "svelte";
  import { emitter } from "./store";

  export let url: string;

  function change(e: Event) {
    const node = e.target as HTMLInputElement;
    emitter.emit("url_change", node.value);
  }

  onMount(() => {
    emitter.on("url_change", (url_) => {
      url = url_;
    });
  });
</script>

<input
  id="url"
  required
  type="url"
  name="url"
  value="{url}"
  form="request"
  placeholder="URL"
  class="w-full p-2"
  on:input="{change}"
/>
