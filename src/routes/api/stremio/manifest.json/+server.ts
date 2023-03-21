import packagejson from '../../../../../package.json'

export function GET() {
    return new Response(JSON.stringify({
        id: 'com.stremio.cftorrent.addon',
        name: 'CF-torrent',
        description: 'Stremio addon based on cloudflare workers',
        version: packagejson.version,
        catalogs: [],
        resources: [
            {
                name: 'stream',
                types: [ 'movie', 'series' ],
                idPrefixes: [ 'tt' ]
            }
        ],
        types: [ 'movie', 'series' ],
    }), {
        status: 200,
        headers: {
            'content-type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
    })
}