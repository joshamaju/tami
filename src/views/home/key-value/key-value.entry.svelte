<script lang="ts" island>
  import type { HTMLAttributes } from "svelte/elements";
  import PlusIcon from "lucide-svelte/icons/plus";
  import Row from "./item.svelte";

  type $$Props = HTMLAttributes<HTMLTableRowElement> & {
    name: string;
    data: Array<{
      id?: string;
      key: string;
      value: string;
      removeable?: boolean;
    }>;
  };

  export let name: $$Props["name"];
  export let id: $$Props["id"] = undefined;
  export let data: $$Props["data"] = [];

  const key_pattern = `${name}[{index}][key]`;
  const value_pattern = `${name}[{index}][value]`;
</script>

<svelte:head>
  <script type="module" src="./define.ts"></script>
</svelte:head>

<key-value-fieldset {id} index="{data.length - 1}" style="display: contents;">
  <div {...$$restProps}>
    <div class="flex items-center justify-between gap-2 p-2">
      <slot name="title" />

      <button type="button" data-trigger="new">
        <PlusIcon size="{20}" class="pointer-events-none" />
      </button>
    </div>

    <table class="w-full border-t border-b text-sm">
      <tbody data-content class="divide-y">
        {#each data as { id, key, value, removeable }, i}
          <Row
            {removeable}
            id="{id ?? `row-${name}-template-${i}`}"
            key="{{
              value: key,
              pattern: key_pattern,
              name: `${name}[${i}][key]`,
            }}"
            value="{{
              value,
              pattern: value_pattern,
              name: `${name}[${i}][value]`,
            }}"
          />
        {/each}
      </tbody>
    </table>
  </div>

  <template>
    <Row
      key="{{ name: `${name}[{index}][key]`, value: '', pattern: key_pattern }}"
      value="{{
        value: '',
        pattern: value_pattern,
        name: `${name}[{index}][value]`,
      }}"
    ></Row>
  </template>
</key-value-fieldset>
