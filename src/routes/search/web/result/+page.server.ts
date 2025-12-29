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
        error(400, 'no query')
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
    return {
        links: (await Promise.all(promises)).flat()
    }
}

