<script lang="ts">
  import TorrentCard from "../../../../components/TorrentCard.svelte";
  export let data: {
    links?: { torrent: string; source: string }[];
  };
  let links = data.links;
</script>

{#if links && links.length > 0}
  {#each links as item}
    <TorrentCard torrent={item.torrent} source={item.source} />
  {/each}
{:else}
  <p>No items found</p>
{/if}