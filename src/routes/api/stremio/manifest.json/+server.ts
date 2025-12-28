import packagejson from '../../../../../package.json'

// 🛡️ Sentinel: Whitelisted Stremio origins to prevent CORS misconfiguration.
// Allowing any origin ('*') is a security risk.
const ALLOWED_ORIGINS = [
    'https://app.strem.io',
    'https://stremio.github.io',
    'https://stremio-development.netlify.app'
];

export function GET({ request }) {
    const origin = request.headers.get('Origin');

    const headers = {
        'content-type': 'application/json',
    };

    // Only set the ACAO header if the request origin is in our whitelist.
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
        headers['Access-Control-Allow-Origin'] = origin;
    }

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
        headers,
    })
}
