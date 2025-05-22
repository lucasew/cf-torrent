<script lang="ts">
  import { rankLinks } from "$lib/rankLinks";
  import type { SearchResult } from "$lib/search";
  import { Badge, Input } from "@sveltestrap/sveltestrap";

  export let data: { links?: SearchResult[] };
  let enable_filter = false;
  // maintain ordered list of results, apply optional quality filter
  let links: SearchResult[] = data.links || [];
  $: if (enable_filter && data.links) {
    const ordered = rankLinks(data.links.map((r) => r.link));
    links = ordered
      .map((l) => data.links!.find((r) => r.link === l))
      .filter((r): r is SearchResult => Boolean(r));
  } else {
    links = data.links || [];
  }
</script>

<hr>

<Input bind:checked={enable_filter} type='checkbox' label="Enable quality filter" />

<hr>

{#if links && links.length > 0}
  <ul>
    {#each links as result}
      <li style="margin-bottom: 0.5rem; display: flex; align-items: center;">
        <a href={result.link} target="_blank" rel="noopener noreferrer">{result.link}</a>
        <Badge color="secondary" class="ms-2">{result.source}</Badge>
      </li>
    {/each}
  </ul>
{:else}
    <p>No items found</p>
{/if}