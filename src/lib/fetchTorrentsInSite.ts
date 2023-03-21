import { REGEX_MATCH_INFOHASH, REGEX_MATCH_MAGNET } from "./constants"
import { decodeTorrent } from "./decodeTorrent"
import { matchFirstGroup } from "./matchFirstGroup"

export async function fetchTorrentsInSite(url: string) {
    try {
        const response = await fetch(url, {
            cf: {
                cacheTtl: 2 * 3600,
                cacheEverything: true
            }
        })
        const contentType = response.headers.get('Content-Type')
        if (contentType === 'application/x-bittorrent' || url.search(REGEX_MATCH_INFOHASH) !== -1 || url.endsWith('.torrent')) {
            const arrayBuffer = await response.arrayBuffer()
            const bencoded = await decodeTorrent(arrayBuffer, null, null, 'utf8')
            let magnetLink = "magnet:?xt=urn:btih:"
            magnetLink += bencoded.infohash
            if (bencoded.info?.name) {
                magnetLink += `&dn=${encodeURIComponent(bencoded.info.name)}`
            }
            const trackers = [ bencoded.announce, bencoded['announce-list'] ].flat()
            trackers.forEach((tracker) => {
                if (tracker) {
                    magnetLink += `&tr=${encodeURIComponent(tracker)}`
                }
            })
            return [ magnetLink ]
        } else if (contentType === 'application/octet-stream') {
            return []
        } else {
            const text = await response.text()
            return matchFirstGroup(text, REGEX_MATCH_MAGNET)
        }

    } catch (e) {
        console.error(e)
        return []
    }
}