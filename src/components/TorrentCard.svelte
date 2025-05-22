<script lang="ts">
	import { Button, Card, CardBody, CardFooter, CardHeader, CardSubtitle, CardTitle } from "@sveltestrap/sveltestrap";

    import SourceBadge from './SourceBadge.svelte'
    export let torrent: string
    export let source: string

    const torrentURL = new URL(torrent)
    console.log(torrentURL)
</script>
<Card class='mb-3'>
  <CardHeader class="d-flex align-items-center">
    <SourceBadge source={source} />
    <CardTitle class="mb-0">{torrentURL.searchParams.get('dn') || '(NO NAME)'}</CardTitle>
  </CardHeader>
    <CardBody>
        <CardSubtitle><b>Trackers</b></CardSubtitle>
        <ul>
            {#each torrentURL.searchParams.getAll('tr') || [] as tracker}
                <li>{tracker}</li>
            {/each}
        </ul>
        <CardSubtitle><b>Infohash</b></CardSubtitle>
        <ul>
            <li>
                {torrentURL.searchParams.get('xt')?.replace('urn:', '').replace('btih:', '')}
            </li>
        </ul>
    </CardBody>
    <CardFooter>
        <Button href="{torrent}" target='_blank'>Download</Button>
    </CardFooter>
</Card>