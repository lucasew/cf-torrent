<script lang="ts">
	import { page } from "$app/stores";
	import { rankLinks } from "$lib/rankLinks";
	import { Breadcrumb, BreadcrumbItem, Input } from "sveltestrap";

    export let data: {
        error?: string
        links?: string[]
    };
    let links = data.links;
    $: links = enable_filter ? rankLinks(data.links || []) : data.links;
    console.log(data)
    let enable_filter = false;
</script>

<Breadcrumb>
    <BreadcrumbItem active>Home</BreadcrumbItem>
    <BreadcrumbItem active>Search Web</BreadcrumbItem>
    <BreadcrumbItem active>{$page.url.searchParams.get('query')}</BreadcrumbItem>
</Breadcrumb>



<Input bind:checked={enable_filter} type='checkbox' label="Enable quality filter" />

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