<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";
  import Check from "lucide-svelte/icons/check";
  import Copy from "lucide-svelte/icons/clipboard-copy";

  type $$Props = HTMLButtonAttributes & { text: string };

  export let text: $$Props["text"];

  let copied = false;

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(text);
      copied = true;
      setTimeout(() => (copied = false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  }
</script>

<button on:click="{copyToClipboard}" class="flex items-center space-x-2">
  {#if copied}
    <Check class="mr-2 h-4 w-4" />
    Copied
  {:else}
    <Copy class="mr-2 h-4 w-4" />
    Copy command
  {/if}
</button>
