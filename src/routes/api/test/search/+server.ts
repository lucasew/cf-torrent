import { duckduckgo, google } from "$lib/search";

export async function GET({url}) {
    const parsedURL = new URL(url);
    const query = parsedURL.searchParams.get('query')
    if (!query) {
        return new Response(JSON.stringify({
            error: "missing query"
        }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
    return new Response(JSON.stringify({
        google: await google(query),
        duckduckgo: await duckduckgo(query)
    }), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}