<script lang="ts">
  import PlusIcon from "lucide-svelte/icons/plus";
  import MenuIcon from "lucide-svelte/icons/menu";
  import CopyIcon from "lucide-svelte/icons/copy";
  import TrashIcon from "lucide-svelte/icons/trash-2";
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

  const get_url = (url: string) => {
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
    'w-1/5 h-full border-r bg-gray-100 space-y-4 py-4 px-2 overflow-auto',
    $$restProps.class ?? '',
  ].join(' ')}"
>
  <div class="flex justify-between px-4">
    <button class="js-toggle-side-nav">
      <MenuIcon size="{20}" class="pointer-events-none" />
    </button>

    <form action="/session/new" method="post">
      <button>
        <PlusIcon size="{20}" />
      </button>
    </form>
  </div>

  <ul class="space-y-2 text-sm">
    {#each sessions as session}
      {@const request = session.request}
      {@const url = get_url(request.url)}
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
          {#if url}
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
            <span>{url.hostname}{url.pathname}</span>
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
