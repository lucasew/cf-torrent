import { fetchTorrentsInLinks } from "$lib/fetchTorrentsInLinks"
import { duckduckgo, google, yandex } from "$lib/search"
import { error } from "@sveltejs/kit"

export async function load({url}) {
    const parsedURL = new URL(url)
    const params = parsedURL.searchParams
    const use_google = params.get('use_google')
    const use_duckduckgo = params.get('use_duckduckgo')
    const use_yandex = params.get('use_yandex')
    const query = params.get('query')
    if (!query) {
        throw error(400, 'no query')
    }
    const promises = []
    if (use_google) {
        promises.push(google(query))
    }
    if (use_duckduckgo) {
        promises.push(duckduckgo(query))
    }
    if (use_yandex) {
        promises.push(yandex(query))
    }
    // Gather search results with source tags
    const searchResults = (await Promise.all(promises)).flat();
    // For each search result, fetch torrents and tag with source
    const fetched = await Promise.all(
        searchResults.map(async (r: any) => {
            const mags = await fetchTorrentsInLinks([r.link]).catch(() => []);
            return mags.map(m => ({ torrent: m, source: r.source }));
        })
    );
    // Flatten, dedupe by torrent URL, keep first source
    const entries = fetched.flat();
    const map = new Map<string, string>();
    for (const { torrent, source } of entries) {
        if (!map.has(torrent)) map.set(torrent, source);
    }
    const links = Array.from(map.entries()).map(([torrent, source]) => ({ torrent, source }));
    return { links };
}


