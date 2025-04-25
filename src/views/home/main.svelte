<script lang="ts">
  import * as E from "fp-ts/lib/Either";

  import Editor from "./editor/editor.entry.svelte";
  import Response from "./response.svelte";

  import type { Result } from "./types";
  import type { Session } from "../../core/session";
  import { ContentType as ContentTypes } from "../../types/content-type";

  import Headers from "./islands/headers.svelte";
  import UrlParams from "./islands/url-params.svelte";
  import type { HTMLAttributes } from "svelte/elements";

  interface $$Props extends HTMLAttributes<HTMLDivElement> {
    session: Session;
    response: E.Either<Error, Result> | undefined;
  }

  export let session: $$Props["session"];
  export let response: $$Props["response"];

  const current_session = session;
  const request = session.request;

  const content_types = [
    { label: "Text", value: ContentTypes.TEXT },
    { label: "JSON", value: ContentTypes.JSON },
    { label: "Form Data", value: ContentTypes.FORMDATA },
    { label: "URL Encoded", value: ContentTypes.URLENCODED },
  ];

  const url = request?.url ?? "";
</script>

<div {...$$restProps}>
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
