<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import TrashIcon from "lucide-svelte/icons/trash-2";

  type KeyValue = { name: string; value: string; id?: string };

  type $$Props = HTMLAttributes<HTMLTableRowElement> & {
    key: KeyValue;
    value: KeyValue;
    index?: number | undefined;
    template?: string | undefined;
  };

  export let key: $$Props["key"];
  export let value: $$Props["value"];
  export let id: $$Props["id"] = undefined;
  export let index: $$Props["index"] = undefined;
  export let template: $$Props["template"] = undefined;

  const removeable = template ? false : true;

  const props = template ? { hidden: true, "data-row-template": template } : {};
</script>

<tr
  {id}
  {...$$restProps}
  {...props}
  data-row-index="{index}"
  class="divide-x {$$props.class}"
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
      data-key-name="{key.value}"
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
        data-value-name="{key.value}"
      />

      <button
        type="button"
        hidden="{!removeable}"
        data-row-target="{id}"
        disabled="{!removeable}"
        data-row-action="remove"
        class="hover:bg-slate-200 rounded-md p-2 js-key-value-remove"
      >
        <TrashIcon size="{15}" class="touch-none pointer-events-none" />
      </button>
    </div>
  </td>
</tr>
