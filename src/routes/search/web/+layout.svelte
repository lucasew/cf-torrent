<script lang='ts'>
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { Breadcrumb, BreadcrumbItem, Button, Form, FormGroup, Input } from "sveltestrap";

    let url = $page.url;

    function handleFormSubmit(e: SubmitEvent) {
        e.preventDefault()
        let newURL = new URL(url.toString())
        if (!newURL.href.endsWith('/result')) {
            newURL.href += "/result"
        }
        newURL.searchParams.set('query', query)
        if (use_google) newURL.searchParams.set('use_google', '1')
        if (use_duckduckgo) newURL.searchParams.set('use_duckduckgo', '1')
        goto(newURL)
    }
    let query = $page.url.searchParams.get('query');
    let use_google = !!$page.url.searchParams.get('use_google')
    let use_duckduckgo = !!$page.url.searchParams.get('use_duckduckgo')
</script>

<Breadcrumb>
    <BreadcrumbItem active>Home</BreadcrumbItem>
    <BreadcrumbItem active>Search Web</BreadcrumbItem>
    {#if $page.url.searchParams.get('query')}
        <BreadcrumbItem active>{$page.url.searchParams.get('query')}</BreadcrumbItem>
    {/if}
</Breadcrumb>

<Form on:submit={handleFormSubmit}>
    <FormGroup floating label="Query">
        <Input bind:value={query} placeholder="Query to search"/>
    </FormGroup>
    <FormGroup floating>
        <Input bind:checked={use_google} type="checkbox" label="Use Google"/>
        <Input bind:checked={use_duckduckgo} type="checkbox" label="Use DuckDuckGO"/>
    </FormGroup>
    <Button type='submit'>Search</Button>
</Form>

<slot/>