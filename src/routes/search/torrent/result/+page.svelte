<script lang="ts">
	import TorrentCard from "../../../../components/TorrentCard.svelte";

    export let data: {
        links?: string[]
    };
    let links = data.links;
    console.log(data)
</script>

{#if links && links.length > 0}
    {#each links as link}
        <TorrentCard torrent={link} />
    {/each}
{:else}
    <p>No items found</p>
{/if}