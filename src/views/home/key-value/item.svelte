<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import TrashIcon from "lucide-svelte/icons/trash-2";

  type KeyValue = { name: string; value: string; id?: string, pattern?: string };

  type $$Props = HTMLAttributes<HTMLTableRowElement> & {
    key: KeyValue;
    value: KeyValue;
    removeable?: boolean | undefined;
  };

  export let key: $$Props["key"];
  export let value: $$Props["value"];
  export let removeable: $$Props["removeable"] = true;
</script>

<tr
  {...$$restProps}
  data-item
  class="{["divide-x", $$props.class].filter(Boolean).join(' ')}"
>
  <td class="w-2/4 p-2">
    <input
      type="text"
      id="{key.id}"
      data-slot="key"
      class="w-full"
      placeholder="Key"
      name="{key.name}"
      value="{key.value}"
      data-name="{key.pattern}"
    />
  </td>
  <td class="w-2/4 p-2">
    <div class="flex gap-2 items-center">
      <input
        type="text"
        id="{value.id}"
        data-slot="value"
        placeholder="Value"
        name="{value.name}"
        class="w-full flex-1"
        value="{value.value}"
        data-name={value.pattern}
      />

      <button
        type="button"
        data-trigger="remove"
        hidden="{!removeable}"
        disabled="{!removeable}"
        class="hover:bg-slate-200 rounded-md p-2 js-key-value-remove"
      >
        <TrashIcon size="{15}" class="touch-none pointer-events-none" />
      </button>
    </div>
  </td>
</tr>
