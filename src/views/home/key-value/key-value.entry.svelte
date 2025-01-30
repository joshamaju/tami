<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import TrashIcon from "lucide-svelte/icons/trash-2";

  type $$Props = HTMLAttributes<HTMLTableRowElement> & {
    key: string;
    value: string;
    removeable?: boolean;
    names: { key: string; value: string };
  };

  export let names: $$Props["names"];
  export let id: $$Props["id"] = undefined;
  export let removeable: $$Props["removeable"] = true;
</script>

<svelte:head>
  <script type="module" src="./script.ts"></script>
</svelte:head>

<tr {id} {...$$restProps} class="divide-x {$$props.class}">
  <td class="w-2/4 p-2">
    <input
      type="text"
      class="w-full"
      placeholder="Key"
      name="{names.key}"
      value="{$$props.key}"
    />
  </td>
  <td class="w-2/4 p-2">
    <div class="flex gap-2 items-center">
      <input
        type="text"
        placeholder="Value"
        name="{names.value}"
        class="w-full flex-1"
        value="{$$props.value}"
      />

      <button
        data-remove
        type="button"
        data-key="{id}"
        hidden="{!removeable}"
        disabled="{!removeable}"
        class="hover:bg-slate-200 rounded-md p-2 js-key-value-remove"
      >
        <TrashIcon size="{15}" class="touch-none pointer-events-none" />
      </button>
    </div>
  </td>
</tr>
