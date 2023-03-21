<script lang="ts">
	import { Button, Card, CardBody, CardFooter, CardHeader, CardSubtitle, CardText, CardTitle } from "sveltestrap";

    export let torrent: string

    const torrentURL = new URL(torrent)
    console.log(torrentURL)

</script>
<Card class='mb-3'>
    <CardHeader>
        <CardTitle>{torrentURL.searchParams.get('dn') || '(NO NAME)'}</CardTitle>
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