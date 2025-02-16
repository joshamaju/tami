<script lang="ts">
  import PlusIcon from "lucide-svelte/icons/plus";
  // import MenuIcon from "lucide-svelte/icons/menu";
  import CopyIcon from "lucide-svelte/icons/copy";
  import GlobeIcon from "lucide-svelte/icons/globe";
  import TrashIcon from "lucide-svelte/icons/trash-2";
  // import SearchIcon from "lucide-svelte/icons/search";
  //   import EllipsisIcon from "lucide-svelte/icons/ellipsis-vertical";

  import type { Session } from "../../core/session";
  import type { HTMLAttributes } from "svelte/elements";
  import { Method } from "../../types/method";

  type $$Props = HTMLAttributes<HTMLElement> & {
    session: Session;
    sessions: Array<Session>;
  };

  export let session: $$Props["session"];
  export let sessions: $$Props["sessions"];

  const current_session = session;

  const get_url = (url: string | null | undefined) => {
    if (!url) return null;

    try {
      return new URL(url);
    } catch (error) {
      return null;
    }
  };
</script>

<nav
  {...$$restProps}
  class="{[
    'w-1/5 h-full border-r bg-gray-100 space-y-2 p-2',
    $$restProps.class ?? '',
  ].join(' ')}"
>
  {#if sessions.length <= 0}
    <div class="h-full flex flex-col items-center justify-center gap-3">
      <div class="p-4 rounded-full bg-slate-200">
        <GlobeIcon size="{100}" class="text-gray-300" />
      </div>
      <h1 class="text-gray-500">Nothing here yet!</h1>
      <form action="/session/new" method="post" class="flex">
        <button
          class="bg-[#4660ff] rounded-md py-1 px-4 text-white text-sm flex items-center gap-1 shadow-md"
        >
          <PlusIcon size="{15}" />
          <span>New request</span>
        </button>
      </form>
    </div>
  {:else}
    <div class="space-y-4">
      <!-- <label class="flex items-center rounded-md bg-white shadow-sm">
        <SearchIcon size="{15}" class="m-2 text-gray-400" />
        <input
          type="text"
          placeholder="Search"
          class="flex-1 bg-none placeholder-gray-300"
        />
      </label> -->

      <ul class="space-y-2 text-sm">
        {#each sessions as session}
          {@const request = session.request}
          {@const url = get_url(request?.url)}
          <li
            title="{request ? `${request.method} ${request?.url}` : null}"
            class="flex items-center justify-between px-4 py-1 gap-2 rounded-md {current_session.slug ==
            session.slug
              ? 'bg-slate-300'
              : ''}"
          >
            <a
              href="/?session={session.slug}"
              class="truncate whitespace-nowrap space-x-2"
            >
              {#if request && url}
                <span
                  class="font-medium {request.method == Method.GET
                    ? 'text-green-600'
                    : request.method == Method.POST
                      ? 'text-blue-600'
                      : request.method == Method.PUT
                        ? 'text-orange-600'
                        : request.method == Method.DELETE
                          ? 'text-red-600'
                          : ''}"
                >
                  {request.method}
                </span>
                <span>
                  {url.hostname}{url.pathname == "/" ? "" : url.pathname}
                </span>
              {:else}
                <span>{session.slug}</span>
              {/if}
            </a>

            <div class="hidden actions">
              <div class="flex gap-2 items-center">
                <!-- <button type="button" popovertarget="popover-action-{i}">
              <EllipsisIcon size="{15}" />
            </button> -->

                <form method="post" action="/session/duplicate">
                  <button name="slug" value="{session.slug}">
                    <CopyIcon size="{15}" />
                  </button>
                </form>

                <form action="/session/delete" method="post" class="contents">
                  <button name="slug" value="{session.slug}">
                    <TrashIcon size="{15}" />
                  </button>
                </form>
              </div>

              <!-- <div popover="auto" id="popover-action-{i}">
            <p>popover</p>
          </div> -->
            </div>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</nav>

<style>
  li:hover .actions {
    display: inline-block;
  }

  /* details > summary {
    list-style: none;
  }

  details > summary::marker,
  details > summary::-webkit-details-marker {
    display: none;
  } */
</style>
