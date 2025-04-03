<script lang="ts">
  import { encode } from "stack54/data";

  import * as E from "fp-ts/Either";

  import PlusIcon from "lucide-svelte/icons/plus";
  import MenuIcon from "lucide-svelte/icons/menu";
  import PlayIcon from "lucide-svelte/icons/play";

  import SideNav from "./nav.svelte";
  import Editor from "./editor/editor.entry.svelte";
  import Document from "../components/document.entry.svelte";
  import Response from "./response.svelte";
  // import Prefetch from "./prefetch.svelte";
  import Spinner from "../components/spinner.svelte";
  import Loader from "../components/loader.svelte";

  import type { Result } from "./types";
  import { Method } from "../../types/method";
  import type { Session } from "../../core/session";
  import { ContentType as ContentTypes } from "../../types/content-type";

  import UrlBar from "./islands/url-bar.svelte";
  import Headers from "./islands/headers.svelte";
  import UrlParams from "./islands/url-params.svelte";

  export let session: Session;
  export let sessions: Array<Session>;
  export let response: E.Either<Error, Result> | undefined;

  const current_session = session;
  const request = session.request;

  const content_types = [
    { label: "Text", value: ContentTypes.TEXT },
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

  const url = request?.url ?? "";
</script>

<Document>
  <svelte:fragment slot="head">
    <!-- <Prefetch
      sessions="{sessions.filter((s) => s.slug !== current_session.slug)}"
    /> -->

    {@html encode({ request }, { id: "HYDRATION_DATA" })}

    {@html encode({ content: request?.body }, { id: "PAGE_DATA" })}

    <link rel="stylesheet" href="./style.css" />

    <script type="module" src="./script.ts"></script>
    <script type="module" src="./islands/hydrate.ts"></script>
  </svelte:fragment>

  <div class="flex flex-col h-full">
    <header
      class="flex items-center justify-between px-4 py-2 border-b bg-white sticky top-0 z-10"
    >
      <div class="flex items-center gap-4">
        <button class="js-toggle-side-nav side-nav-toggle">
          <MenuIcon size="{20}" class="pointer-events-none" />
        </button>

        <img src="/logo.svg" alt="Tami" width="60" />
      </div>

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

      <div></div>
    </header>

    <div class="flex flex-1 h-full overflow-hidden">
      <SideNav
        {session}
        {sessions}
        class="side-nav overflow-auto sticky top-0"
      />

      <div class="flex-1 h-full overflow-auto">
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
            <div id="query-container">
              <UrlParams {url} />
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

            <div class="border h-40">
              <Editor
                language="js"
                id="body-editor"
                class="block h-full"
                code="{request?.body ?? ''}"
              />
            </div>

            <input
              hidden
              id="body"
              type="text"
              name="body"
              value="{request?.body ?? ''}"
            />
          </div>

          <div
            hidden
            role="tabpanel"
            id="req-headers-panel"
            aria-labelledby="req-headers-tab"
          >
            <div id="headers-container">
              <Headers data="{request?.headers ?? {}}" />
            </div>
          </div>
        </form>

        <div id="result" hx-swap-oob="true">
          <Response {response} />
        </div>
      </div>
    </div>
  </div>

  <div class="loader">
    <Loader />
  </div>

  <script>
    document.addEventListener("DOMContentLoaded", () => {
      document.body.classList.add("loaded");
    });
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
    transition: all 0.5s;
    justify-content: center;
    background-color: #000;
  }

  :global(body.loaded) .loader {
    /* display: none; */
    opacity: 0;
    visibility: hidden;
  }
</style>
