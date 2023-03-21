<script lang="ts">
	import { page } from "$app/stores";
	import { Breadcrumb, BreadcrumbItem, Container, Row } from "sveltestrap";
	import TorrentCard from "../../../../components/TorrentCard.svelte";

    export let data: {
        error?: string
        links?: string[]
    };
    let links = data.links;
    console.log(data)
</script>

<Breadcrumb>
    <BreadcrumbItem active>Home</BreadcrumbItem>
    <BreadcrumbItem active>Search Torrent</BreadcrumbItem>
    <BreadcrumbItem active>{$page.url.searchParams.get('query')}</BreadcrumbItem>
</Breadcrumb>

<hr>

<p>Error: {data.error}</p>
{#if links && links.length > 0}
    {#each links as link}
        <TorrentCard torrent={link} />
    {/each}
{:else}
    <p>No items found</p>
{/if}