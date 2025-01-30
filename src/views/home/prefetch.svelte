<script lang="ts">
  import type { Session } from "../../core/session";
  import Fragment from "../components/fragment.svelte";

  export let sessions: Array<Session>;
</script>

<Fragment>
  {#each sessions as session}
    <link rel="prefetch" href="/?session={session.slug}" />
  {/each}
</Fragment>
