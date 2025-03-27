<script lang="ts" island>
  import type { HTMLAttributes } from "svelte/elements";
  import PlusIcon from "lucide-svelte/icons/plus";
  import TrashIcon from "lucide-svelte/icons/trash-2";

  import { onMount } from "svelte";
  import { emitter } from "./store";

  type $$Props = HTMLAttributes<HTMLDivElement> & { url: string };

  const name = "query";
  const empty = [["", ""]] as const;

  export let url: $$Props["url"];

  $: entries = [...new URLSearchParams(new URL(url).searchParams)];

  function get_value(e: Event) {
    const node = e.target as HTMLInputElement;
    return node.value;
  }

  onMount(() => {
    emitter.on("url_change", (url_) => {
      url = url_;
    });
  });
</script>

<div {...$$restProps}>
  <div class="flex items-center justify-between gap-2 p-2">
    <label for="parameters" class="block"> Query Parameters </label>

    <button
      type="button"
      on:click="{() => {
        const url_ = new URL(url);
        const search = new URLSearchParams(url_.searchParams);

        search.append('', '');
        url_.search = search.toString();

        emitter.emit('url_change', url_.toString());
      }}"
    >
      <PlusIcon size="{20}" class="pointer-events-none" />
    </button>
  </div>

  <table class="w-full border-t border-b text-sm">
    <tbody class="divide-y">
      {#each entries.length <= 0 ? empty : entries as [key, value], i (i)}
        <tr class="{['divide-x', $$props.class].filter(Boolean).join(' ')}">
          <td class="w-2/4 p-2">
            <input
              type="text"
              value="{key}"
              class="w-full"
              placeholder="Key"
              name="${name}[{i}][key]"
              on:input="{(e) => {
                const url_ = new URL(url);
                const search = new URLSearchParams(url_.searchParams);

                const entries = [...search.entries()];

                const value = get_value(e);

                if (entries[i]) {
                  const [, v] = entries[i];
                  entries[i] = [value, v];
                } else {
                  entries.push([value, '']);
                }

                url_.search = new URLSearchParams(entries).toString();

                emitter.emit('url_change', url_.toString());
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
                name="${name}[{i}][value]"
                on:input="{(e) => {
                  const url_ = new URL(url);
                  const search = new URLSearchParams(url_.searchParams);

                  const entries = [...search.entries()];

                  const value = get_value(e);

                  if (entries[i]) {
                    const [k] = entries[i];
                    entries[i] = [k, value];
                  } else {
                    entries.push([key, value]);
                  }

                  url_.search = new URLSearchParams(entries).toString();

                  emitter.emit('url_change', url_.toString());
                }}"
              />

              <button
                type="button"
                class="hover:bg-slate-200 rounded-md p-2"
                on:click="{() => {
                  const url_ = new URL(url);
                  const search = new URLSearchParams(url_.searchParams);

                  const entries = [...search.entries()];

                  entries.splice(i, 1);

                  url_.search = new URLSearchParams(entries).toString();

                  emitter.emit('url_change', url_.toString());
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
