import { fetchTorrentsInLinks } from "$lib/fetchTorrentsInLinks"
import { getTitleFromIMDB } from "$lib/getTitleFromIMDB"
import { duckduckgo, google, yandex } from "$lib/search"

export async function GET({params, url}) {
    const title = await getTitleFromIMDB(params.name)
    const siteLinks = (await Promise.all(
        [google, duckduckgo, yandex].map(f => f(`${title} torrent`))
    )).flat()
    const links = await fetchTorrentsInLinks(siteLinks)
    return new Response(JSON.stringify({
        streams: links.map(link => {
            const parsedURL = new URL(link)
            let infoHash = parsedURL.searchParams.get('xt')
            if (infoHash) {
                infoHash = infoHash
                    .replace('urn:', '')
                    .replace('btih:', '')
            }
            if (!infoHash || infoHash.length != 40) {
                return null
            }
            const title = parsedURL.searchParams.get('dn') || '(NO NAME)'
            return {infoHash, title}
        }).filter(x => x != null)
    }), {
        headers: {
            'content-type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    })
}