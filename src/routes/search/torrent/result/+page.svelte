<script lang="ts">
	import { page } from "$app/stores";
	import { Breadcrumb, BreadcrumbItem, Input } from "sveltestrap";

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
    <ul>
    {#each links as link}
        <li>
            <a href="{link}" target='_blank'>{link}</a>
        </li>
    {/each}
    </ul>
{:else}
    <p>No items found</p>
{/if}