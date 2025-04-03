<script lang="ts">
  import PlusIcon from "lucide-svelte/icons/plus";
  import PlayIcon from "lucide-svelte/icons/play";

  import Spinner from "../components/spinner.svelte";

  import { Method } from "../../types/method";
  import type { Session } from "../../core/session";

  import UrlBar from "./islands/url-bar.svelte";

  export let session: Session;

  const request = session.request;

  const selected_method = request?.method ?? Method.GET;

  const methods = [
    { label: "GET", value: Method.GET },
    { label: "POST", value: Method.POST },
    { label: "PUT", value: Method.PUT },
    { label: "PATCH", value: Method.PATCH },
    { label: "DELETE", value: Method.DELETE },
  ];

  const url = request?.url ?? "";
</script>

<header
  class="flex items-center justify-between px-4 py-2 border-b bg-white sticky top-0 z-10"
>
  <slot name="leading" />

  <div class="flex items-center gap-4 w-2/4">
    <form action="/session/new" method="post" class="flex">
      <button title="New request">
        <PlusIcon size="{20}" />
      </button>
    </form>

    <div
      class="flex border items-center rounded-md flex-1 overflow-hidden text-sm input-box"
    >
      <select class="px-2" name="method" form="request">
        {#each methods as method}
          <option
            selected="{selected_method == method.value}"
            value="{method.value}"
          >
            {method.label}
          </option>
        {/each}
      </select>

      <div class="flex-1" id="url-container">
        <UrlBar {url} />
      </div>
    </div>

    <button
      type="submit"
      form="request"
      id="init-request"
      class="border rounded-md bg-white text-[#4660ff] px-4 py-1 flex items-center gap-2"
    >
      <PlayIcon size="{15}" />
      Send
    </button>

    <div id="request-loader" class="htmx-indicator hidden border">
      <Spinner />

      <button
        type="button"
        onclick="htmx.trigger('#request', 'htmx:abort')"
        class="border border-red-500 rounded-md text-red-500 px-4 py-1"
      >
        Cancel
      </button>
    </div>
  </div>

  <slot name="trailing">
    <div></div>
  </slot>
</header>
