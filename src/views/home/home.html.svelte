<script lang="ts">
  import { encode } from "stack54/data";

  import * as E from "fp-ts/Either";

  import PlusIcon from "lucide-svelte/icons/plus";
  import MenuIcon from "lucide-svelte/icons/menu";
  import PlayIcon from "lucide-svelte/icons/play";

  import SideNav from "./nav.svelte";
  import KeyValue from "./key-value/key-value.entry.svelte";
  import Editor from "./editor/editor.entry.svelte";
  import Document from "../components/document.entry.svelte";

  import type { Result } from "./types";
  import { Method } from "../../types/method";
  import type { Session } from "../../core/session";
  import { ContentType as ContentTypes } from "../../types/content-type";
  import Response from "./response.svelte";
  import Prefetch from "./prefetch.svelte";
  import Spinner from "../components/spinner.svelte";
  import Loader from "../components/loader.svelte";

  export let session: Session;
  export let sessions: Array<Session>;
  export let response: E.Either<Error, Result> | undefined;

  const current_session = session;
  const request = session.request;

  const content_types = [
    { label: "JSON", value: ContentTypes.JSON },
    { label: "Form Data", value: ContentTypes.FORMDATA },
    { label: "URL Encoded", value: ContentTypes.URLENCODED },
  ];

  const selected_method = request?.method ?? Method.GET;

  const methods = [
    { label: "GET", value: Method.GET },
    { label: "POST", value: Method.POST },
    { label: "PUT", value: Method.PUT },
    { label: "PATCH", value: Method.PATCH },
    { label: "DELETE", value: Method.DELETE },
  ];

  const query_names = { key: "query_key", value: "query_value" };
  const header_names = { key: "header_key", value: "header_value" };
</script>

<Document>
  <svelte:fragment slot="head">
    <Prefetch
      sessions="{sessions.filter((s) => s.slug !== current_session.slug)}"
    />

    {@html encode({ content: request?.body }, { id: "PAGE_DATA" })}

    <link rel="stylesheet" href="./style.css" />

    <script type="module" src="./script.ts"></script>
  </svelte:fragment>

  <div class="flex h-full">
    <SideNav {session} {sessions} class="side-nav" />

    <div class="flex-1 h-full overflow-auto">
      <header
        class="flex items-center justify-center px-4 py-2 border-b bg-white sticky top-0 z-10"
      >
        <button class="js-toggle-side-nav side-nav-toggle hidden">
          <MenuIcon size="{20}" class="pointer-events-none" />
        </button>

        <div class="flex items-center gap-4 w-2/4">
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

            <input
              id="url"
              required
              type="url"
              name="url"
              form="request"
              placeholder="URL"
              class="flex-1 p-2"
              value="{request?.url}"
            />
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

        <div></div>
      </header>

      <form
        id="request"
        method="post"
        hx-select="#result"
        hx-target="#result"
        hx-indicator="#request-loader"
        action="/?session={current_session.slug}"
        hx-post="/?session={current_session.slug}"
      >
        <nav
          id="request-tabs"
          aria-label="Content to view"
          class="flex divide-x border-b"
        >
          <button
            id="raw-tab"
            type="button"
            class="tab js-tab"
            aria-controls="parameters-panel"
          >
            Parameters
          </button>

          <button
            data-active
            type="button"
            id="headers-tab"
            class="tab js-tab"
            aria-controls="body-panel"
          >
            Body
          </button>

          <button
            type="button"
            class="tab js-tab"
            id="req-headers-tab"
            aria-controls="req-headers-panel"
          >
            Headers
          </button>
        </nav>

        <div
          hidden
          role="tabpanel"
          id="parameters-panel"
          aria-labelledby="parameters-tab"
        >
          <div class="flex items-center justify-between gap-2 p-2">
            <label for="parameters" class="block">Query Parameters</label>
            <button type="button" class="js-add-query">
              <PlusIcon size="{20}" />
            </button>
          </div>

          <div>
            <table class="w-full border-t border-b text-sm">
              <tbody class="divide-y">
                {#if request.query}
                  {#each request.query as [key, value], i}
                    <KeyValue
                      {key}
                      {value}
                      id="query-{i}"
                      class="js-query-row"
                      names="{query_names}"
                    />
                  {/each}
                {/if}

                <KeyValue
                  key=""
                  value=""
                  removeable="{false}"
                  class="js-query-row"
                  names="{query_names}"
                />
              </tbody>
            </table>
          </div>
        </div>

        <div id="body-panel" role="tabpanel" aria-labelledby="body-tab">
          <div class="flex justify-between items-center">
            <label for="body" class="py-2 px-4 block"> Request Body </label>

            <p class="flex items-center gap-2 px-4 py-2 text-sm">
              <label for="content-type">Content Type</label>

              <select
                id="content-type"
                name="content-type"
                class="border rounded-md p-1"
              >
                <option value=""></option>
                {#each content_types as { value, label }}
                  <option
                    {value}
                    selected="{value == request?.headers?.['Content-Type']}"
                  >
                    {label}
                  </option>
                {/each}
              </select>
            </p>
          </div>

          <div class="border min-h-40">
            <Editor
              id="body-editor"
              language="js"
              code="{request.body ?? ''}"
            />
          </div>

          <input
            hidden
            id="body"
            type="text"
            name="body"
            value="{request.body ?? ''}"
          />
        </div>

        <div
          hidden
          role="tabpanel"
          id="req-headers-panel"
          aria-labelledby="req-headers-tab"
        >
          <div class="flex items-center justify-between gap-2 p-2">
            <label for="header_key" class="block">Headers List</label>
            <button type="button" class="js-add-header">
              <PlusIcon size="{20}" />
            </button>
          </div>

          <table class="w-full border-t border-b text-sm">
            <tbody class="divide-y">
              {#if request.headers}
                {#each Object.entries(request.headers) as [key, value]}
                  <KeyValue
                    {key}
                    {value}
                    class="js-header-row"
                    names="{header_names}"
                    id="{key == 'Content-Type' ? 'content-type' : null}"
                  />
                {/each}
              {/if}

              <KeyValue
                key=""
                value=""
                removeable="{false}"
                class="js-header-row"
                names="{header_names}"
              />
            </tbody>
          </table>
        </div>
      </form>

      <div id="result" hx-swap-oob="true">
        <Response {response} />
      </div>
    </div>
  </div>

  <div class="loader">
    <Loader />
  </div>

  <script>
    document.body.classList.add("loaded");
  </script>
</Document>

<style>
  .loader {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    z-index: 1000;
    position: fixed;
    align-items: center;
    justify-content: center;
    background-color: #000;
  }

  :global(body.loaded) .loader {
    display: none;
  }
</style>
