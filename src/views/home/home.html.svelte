<script lang="ts">
  import { encode } from "stack54/data";

  import * as E from "fp-ts/Either";

  import XIcon from "lucide-svelte/icons/x";
  import MenuIcon from "lucide-svelte/icons/menu";

  import SideNav from "./nav.svelte";
  import Document from "../components/document.entry.svelte";
  import Loader from "../components/loader.svelte";

  import type { Result } from "./types";
  import type { Session } from "../../core/session";

  import Header from "./header.svelte";
  import Main from "./main.svelte";

  export let preview = false;
  export let session: Session;
  export let sessions: Array<Session>;
  export let response: E.Either<Error, Result> | undefined;

  const request = session.request;
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
    <Header {session}>
      <svelte:fragment slot="leading">
        {#if preview}
          <button class="js-close-preview">
            <XIcon size="{20}" class="pointer-events-none" />
          </button>
        {:else}
          <div class="flex items-center gap-4">
            <button class="js-toggle-side-nav side-nav-toggle">
              <MenuIcon size="{20}" class="pointer-events-none" />
            </button>

            <img src="/logo.svg" alt="Tami" width="60" />
          </div>
        {/if}
      </svelte:fragment>
    </Header>

    <div class="flex flex-1 h-full overflow-hidden">
      {#if !preview}
        <SideNav
          {session}
          {sessions}
          class="side-nav overflow-auto sticky top-0"
        />
      {/if}

      <Main {session} {response} class="flex-1 h-full overflow-auto" />
    </div>
  </div>

  {#if !preview}
    <dialog id="preview" class="w-[75%] h-[80%] rounded-lg border border-gray-300"></dialog>
  {/if}

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
