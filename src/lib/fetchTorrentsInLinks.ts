import { fetchTorrentsInSite } from "./fetchTorrentsInSite";
import { htmlDecode } from "./htmlDecode";
import { rankLinks } from "./rankLinks";

export async function fetchTorrentsInLinks(links: string[]) {
    const sortedLinks = rankLinks(links)
    const fetched = await Promise.all(sortedLinks
        .map((t) => fetchTorrentsInSite(t)
            .catch(e => [])))
    const fetchedProcessed = fetched
        .flat()
        .map(x => htmlDecode(x))
        .sort(t => -t.indexOf('dn='))
    return [...new Set(fetchedProcessed)]

}