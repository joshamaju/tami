<script lang="ts">
  import { encode } from "stack54/data";
  import { getLocals } from "stack54/locals";

  import * as O from "fp-ts/Option";
  import * as E from "fp-ts/Either";
  import { constNull, identity, pipe } from "fp-ts/function";

  import * as semver from "semver";

  import XIcon from "lucide-svelte/icons/x";
  import BellIcon from "lucide-svelte/icons/bell";
  import MenuIcon from "lucide-svelte/icons/menu";
  import HistoryIcon from "lucide-svelte/icons/history";

  import SideNav from "./nav.svelte";
  import Document from "../components/document.entry.svelte";
  import Loader from "../components/loader.svelte";

  import type { Result } from "./types";
  import type { Session } from "../../core/session";

  import Header from "./header.svelte";
  import Main from "./main.svelte";
  import Copy from "./copy.svelte";

  export let preview = false;
  export let session: Session;
  export let sessions: Array<Session>;
  export let response: E.Either<Error, Result> | undefined;

  const request = session.request;

  const { version } = getLocals();

  const v = O.fromNullable(version);

  const has_update = pipe(
    v,
    O.bind("l", (_) => _.latest),
    O.bind("c", (_) => O.some(_.current)),
    O.map((_) => semver.lt(_.c, _.l)),
    O.match(() => false, identity)
  );

  const latest = pipe(
    v,
    O.chain((_) => _.latest),
    O.getOrElseW(constNull)
  );

  const latest_version = `npx tami-client@${latest}`;
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

            <div class="flex space-x-2 items-center">
              <img src="/logo.svg" alt="Tami" width="60" />
              <p class="text-sm border rounded-full px-3">
                v{version?.current}
              </p>
            </div>
          </div>
        {/if}
      </svelte:fragment>

      <svelte:fragment slot="trailing">
        {#if !preview}
          <div class="flex items-center space-x-4">
            {#if has_update}
              <button class="relative js-version-update">
                <BellIcon size="{20}" class="pointer-events-none" />
                <span
                  class="absolute -top-1 -right-1 flex h-3 w-3 pointer-events-none"
                >
                  <span
                    class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
                  ></span>
                  <span
                    class="relative inline-flex rounded-full h-3 w-3 bg-red-500"
                  ></span>
                </span>
              </button>
            {/if}

            <form method="get" action="/version-check">
              <button
                name="go"
                title="check for update"
                value="/?session={session.slug}"
              >
                <HistoryIcon size="{20}" class="pointer-events-none" />
              </button>
            </form>
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
    <dialog
      id="preview"
      class="w-[75%] h-[80%] rounded-lg border border-gray-300"
    ></dialog>

    <dialog
      id="update-modal"
      class="w-80 p-4 bg-white border-gray-200 rounded-md"
    >
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h4 class="font-medium text-gray-900">New version available</h4>
          <div
            class="rounded-full border px-2.5 py-0.5 text-xs bg-red-400 hover:bg-red-500 text-white font-semibold"
          >
            v{latest}
          </div>
        </div>
        <p class="text-sm text-gray-500">
          A new version of TAMI is available. Update to get the latest features
          and bug fixes.
        </p>
        <div
          class="flex items-center rounded-md p-2 text-sm font-mono bg-gray-100"
        >
          {latest_version}
        </div>
        <div class="flex justify-between">
          <form method="dialog">
            <button
              class="border-gray-200 hover:bg-gray-100 rounded-md px-3 py-1"
            >
              Dismiss
            </button>
          </form>

          <div class="js-copy-version" data-text="{latest_version}">
            <Copy
              text="{latest_version}"
              class="bg-blue-500 hover:bg-blue-600 text-white"
            />
          </div>
        </div>
      </div>
    </dialog>
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
