<script lang="ts">
  import { rankLinks } from "$lib/rankLinks";
  import type { SearchResult } from "$lib/search";

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

<div class="form-control">
  <label class="label cursor-pointer justify-start gap-2">
    <input type="checkbox" bind:checked={enable_filter} class="checkbox checkbox-primary" />
    <span class="label-text">Enable quality filter</span>
  </label>
</div>

<div class="divider"></div>

{#if links && links.length > 0}
  <ul class="space-y-2">
    {#each links as result}
      <li class="flex items-center gap-2">
        <a href={result.link} target="_blank" rel="noopener noreferrer" class="link link-primary">{result.link}</a>
        <span class="badge badge-secondary">{result.source}</span>
      </li>
    {/each}
  </ul>
{:else}
    <p class="text-base-content/70">No items found</p>
{/if}