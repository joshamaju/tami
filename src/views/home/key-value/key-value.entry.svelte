<script lang="ts" island>
  import type { HTMLAttributes } from "svelte/elements";
  import PlusIcon from "lucide-svelte/icons/plus";
  import Row from "./item.svelte";

  type $$Props = HTMLAttributes<HTMLTableRowElement> & {
    name: string;
    data: Array<{ key: string; value: string; id?: string }>;
  };

  export let name: $$Props["name"];
  export let data: $$Props["data"] = [];
</script>

<svelte:head>
  <script type="module" src="./script.ts"></script>
</svelte:head>

<div {...$$restProps}>
  <div class="flex items-center justify-between gap-2 p-2">
    <slot name="title" />

    <button
      type="button"
      data-name="{name}"
      data-row-action="new"
      data-index="{data.length}"
    >
      <PlusIcon size="{20}" class="pointer-events-none" />
    </button>
  </div>

  <table class="w-full border-t border-b text-sm">
    <tbody class="divide-y">
      {#each data as { id, key, value }, i}
        <Row
          index="{i}"
          id="{id ?? `row-${name}-template=${i}`}"
          value="{{ name: `${name}[${i}][value]`, value }}"
          key="{{ name: `${name}[${i}][key]`, value: key }}"
        />
      {/each}

      <Row
        template="{name}"
        key="{{ name: '', value: '' }}"
        value="{{ name: '', value: '' }}"
      />
    </tbody>
  </table>
</div>
