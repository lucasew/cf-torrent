import { fetchTorrentsInLinks } from "$lib/fetchTorrentsInLinks"
import { duckduckgo, google } from "$lib/search"
import { error } from "@sveltejs/kit"

export async function load({url}) {
    const parsedURL = new URL(url)
    const params = parsedURL.searchParams
    const use_google = params.get('use_google')
    const use_duckduckgo = params.get('use_duckduckgo')
    const query = params.get('query')
    if (!query) {
        throw error(400, 'no query')
    }
    let promises = []
    if (use_google) {
        promises.push(google(query))
    }
    if (use_duckduckgo) {
        promises.push(duckduckgo(query))
    }
    const siteLinks = (await Promise.all(promises)).flat()
    return {
        links: await fetchTorrentsInLinks(siteLinks)
    }
}


