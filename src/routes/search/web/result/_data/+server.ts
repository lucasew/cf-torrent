import { duckduckgo, google } from "$lib/search"

export async function GET({url}) {
    const parsedURL = new URL(url)
    const params = parsedURL.searchParams
    const use_google = params.get('use_google')
    const use_duckduckgo = params.get('use_duckduckgo')
    const query = params.get('query')
    if (!query) {
        return new Response(JSON.stringify({
            error: 'no query',
        }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
    let promises = []
    if (use_google) {
        promises.push(google(query))
    }
    if (use_duckduckgo) {
        promises.push(duckduckgo(query))
    }
    console.log(promises)
    return new Response(JSON.stringify({
        links: (await Promise.all(promises)).flat(),
    }), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}