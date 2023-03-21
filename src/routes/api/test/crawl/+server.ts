import { fetchTorrentsInSite } from "$lib/fetchTorrentsInSite";

export async function GET({url}) {
    const parsedURL = new URL(url);
    const query = parsedURL.searchParams.get('url')
    if (!query) {
        return new Response(JSON.stringify({
            error: 'missing url'
        }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
    return new Response(JSON.stringify({
        links: await fetchTorrentsInSite(query)
    }), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}