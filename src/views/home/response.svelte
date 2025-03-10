<script lang="ts">
  import prettyBytes from "pretty-bytes";
  import { byteLength } from "byte-length";

  import * as E from "fp-ts/lib/Either";

  import PlugZapIcon from "lucide-svelte/icons/plug-zap";

  import Editor from "./editor/editor.entry.svelte";

  import type { Result } from "./types";
  import { display_time } from "../../core/utils";

  export let response: E.Either<Error, Result> | undefined;

  const res = response && E.isRight(response) ? response.right : null;
  const body_size = res?.body ? prettyBytes(byteLength(res.body)) : null;
</script>

{#if res}
  <section>
    <div class="flex items-center gap-4 px-4 py-2 text-sm">
      <p>
        Status - <span class="text-green-700">
          {res.status} · {res.statusText}
        </span>
      </p>
      <p>
        Time - <span class="text-green-700">{display_time(res.duration)}</span>
      </p>
      <p>Size - <span class="text-green-700">{body_size ?? 0}</span></p>
    </div>

    <div>
      <nav
        id="response-tabs"
        aria-label="Content to view"
        class="flex border-t border-b divide-x js-tab"
      >
        <button
          data-active
          type="button"
          class="tab js-tab"
          id="response-body-tab"
          aria-controls="response-body-panel"
        >
          Body
        </button>

        <button
          type="button"
          id="headers-tab"
          class="tab js-tab"
          aria-controls="headers-panel"
        >
          Headers
        </button>
      </nav>

      <div
        role="tabpanel"
        id="response-body-panel"
        aria-labelledby="response-body-tab"
      >
        <div class="flex items-center justify-between border-b">
          <h3 class="mx-4">Content</h3>

          <nav
            id="body-tabs"
            class="flex js-tab text-sm"
            aria-label="Content to view"
          >
            <button
              data-active
              type="button"
              id="pretty-tab"
              class="tab js-tab"
              aria-controls="pretty-panel"
            >
              Pretty
            </button>

            <button
              id="raw-tab"
              type="button"
              class="tab js-tab"
              aria-controls="raw-panel"
            >
              Raw
            </button>
          </nav>
        </div>

        <div role="tabpanel" id="pretty-panel" aria-labelledby="pretty-tab">
          {#if res.formatted?.type == "json" || res.formatted?.type == "xml"}
            {@const type = res.formatted?.type}
            <div class="h-full max-h-full overflow-auto response-pretty">
              <Editor
                readonly
                code="{res.formatted.formatted}"
                language="{type == 'xml' ? 'html' : 'js'}"
              />
            </div>
          {/if}

          {#if res.formatted?.type == "image"}
            <img src="{res.formatted.content}" alt="Response preview" />
          {/if}
        </div>

        <div hidden id="raw-panel" role="tabpanel" aria-labelledby="raw-tab">
          <div class="h-full max-h-full overflow-auto px-4 py-2">
            <pre><code>{res.body}</code></pre>
          </div>
        </div>
      </div>

      <div
        hidden
        role="tabpanel"
        id="headers-panel"
        aria-labelledby="headers-tab"
      >
        <table class="w-full text-sm">
          <tbody class="divide-y">
            {#each Object.entries(res.headers) as [key, value]}
              <tr class="divide-x">
                <td class="p-2 w-2/4">{key}</td>
                <td class="p-2 w-2/4">{value}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </section>
{/if}

{#if response && E.isLeft(response)}
  <div class="flex flex-col items-center justify-center px-4 py-20 gap-4">
    <div class="p-4 rounded-full bg-slate-100">
      <PlugZapIcon size="{100}" class="text-gray-300" />
    </div>

    <p class="bg-red-200 px-4 py-1 rounded-lg">
      {JSON.stringify(response.left.cause)}
    </p>
  </div>
{/if}
