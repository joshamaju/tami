<script lang="ts" island>
  import type { HTMLAttributes } from "svelte/elements";
  import PlusIcon from "lucide-svelte/icons/plus";
  import TrashIcon from "lucide-svelte/icons/trash-2";

  import { onMount } from "svelte";
  import { emitter } from "./store";
  import type { IRequest } from "../../../types/session";

  type $$Props = HTMLAttributes<HTMLDivElement> & { data: IRequest["headers"] };

  const name = "header";
  const empty = [["", ""]] as const;

  export let data: $$Props["data"];

  let headers = [...Object.entries(data)];

  function get_value(e: Event) {
    const node = e.target as HTMLInputElement;
    return node.value;
  }

  onMount(() => {
    emitter.on("header_change", (e) => {
      const entries = [...headers];

      const i = entries.findIndex(([k]) => k == e.key);

      if (entries[i]) {
        const [k] = entries[i];
        entries[i] = [k, e.value];
      } else {
        entries.push([e.key, e.value]);
      }

      headers = entries;
    });
  });
</script>

<div {...$$restProps}>
  <div class="flex items-center justify-between gap-2 p-2">
    <label for="header_key" class="block"> Headers List </label>

    <button
      type="button"
      on:click="{() => {
        headers = [...headers, ['', '']];
      }}"
    >
      <PlusIcon size="{20}" class="pointer-events-none" />
    </button>
  </div>

  <table class="w-full border-t border-b text-sm">
    <tbody class="divide-y">
      {#each headers.length <= 0 ? empty : headers as [key, value], i (i)}
        <tr class="{['divide-x', $$props.class].filter(Boolean).join(' ')}">
          <td class="w-2/4 p-2">
            <input
              type="text"
              value="{key}"
              class="w-full"
              placeholder="Key"
              name="{name}[{i}][key]"
              on:input="{(e) => {
                const entries = [...headers];

                const value = get_value(e);

                if (entries[i]) {
                  const [, v] = entries[i];
                  entries[i] = [value, v];
                } else {
                  entries.push([value, '']);
                }

                headers = entries;
              }}"
            />
          </td>
          <td class="w-2/4 p-2">
            <div class="flex gap-2 items-center">
              <input
                type="text"
                {value}
                placeholder="Value"
                class="w-full flex-1"
                name="{name}[{i}][value]"
                on:input="{(e) => {
                  const entries = [...headers];

                  const value = get_value(e);

                  if (entries[i]) {
                    const [k] = entries[i];
                    entries[i] = [k, value];
                  } else {
                    entries.push([key, value]);
                  }

                  headers = entries;
                }}"
              />

              <button
                type="button"
                class="hover:bg-slate-200 rounded-md p-2"
                on:click="{() => {
                  const entries = [...headers];
                  entries.splice(i, 1);
                  headers = entries;
                }}"
              >
                <TrashIcon size="{15}" class="touch-none pointer-events-none" />
              </button>
            </div>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
