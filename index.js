import homepage from './index.html.in'
const packagejson = require('./package.json')

global.Buffer = require('buffer').Buffer

const promiseLimit = require('promise-limit')
const {decode: htmlDecode} = require('he')
const decodeTorrent = require('./bencode_decode.js')

let concurrentConnections = 0;

addEventListener('fetch', event => {
    concurrentConnections = 0
    event.respondWith(handleRequest(event))
})

const ignoredDomains = [
    "archive.org",
    "drive.google.com",
    "facebook.com",
    "imdb.com",
    "proxy",
    "reddit.com",
    "sites.google.com",
    "torrentfreak",
    "vpn",
    "wixsite.com",
    "youtube.com",
]

const fetchLimiter = promiseLimit(6)

const REGEX_IGNORED_DOMAINS = new RegExp(ignoredDomains.join("|"), 'i')

async function fetchWithCache(event, _url, cacheTTL, options = {}) {
  const url = new URL(_url)
  const cache = caches.default
  let response = await cache.match(_url)
  if (!response) {
    console.log(
      `Response for request url '${url.toString()}' not present in cache. Fetching...`,
    )
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 2000)
    response = await fetchLimiter(() => fetch(_url, {
      signal: controller.signal,
      ...options
    }).finally(v => {
      clearTimeout(timeout)
      return v
    }))
    response = new Response(response.body, response)
    response.headers.append('Cache-Control', `s-maxage=${cacheTTL}`)
    event.waitUntil(cache.put(_url, response.clone()))
  } else {
    console.log(`Response for request url '${url.toString()}' cachehit`)
  }
  return response
}

function matchFirstGroup(text, regexp) {
  const items = [...text.matchAll(regexp)]
  return items.map(l => decodeURIComponent(l[1]))
}

const REGEX_MATCH_MAGNET = /(magnet:[^"' ]*)/g
async function fetchTorrentsInSite(event, url) {
    try {
    const response = await fetchWithCache(event, url, 2 * 3600)
    const contentType = response.headers.get('Content-Type')
    switch (contentType) {
        case 'application/x-bittorrent':
            console.log("TODO: ingest torrent files with info hash and so on")
            return []
            // const arrayBuffer = await response.arrayBuffer()
            // const bencoded = decodeTorrent(arrayBuffer, null, null, 'utf8')
            // console.log(bencoded)
            // console.log(JSON.stringify(bencoded))
        case 'application/octet-stream':
            return []
        default:
            const text = await response.text()
            return matchFirstGroup(text, REGEX_MATCH_MAGNET)
    }
    } catch (e) {
        console.error(e)
        return []
    }
}

const REGEX_GOOGLE_MATCH_URL = /\/url\\?q=([^"&]*)/g
async function fetchLinksInGoogle(event, query) {
  const response = await fetchWithCache(
    event,
    `https://www.google.com/search?q=${encodeURIComponent(query)}`,
    3600,
  )
  const responseText = await response.text()
  try {
    return matchFirstGroup(responseText, REGEX_GOOGLE_MATCH_URL)
  } catch (e) {
    console.error(e)
    return []
  }
}

const REGEX_DDG_MATCH_URL = /uddg=([^&"]*)/g
async function fetchLinksInDuckDuckGo(event, query) {
  const response = await fetchWithCache(
    event,
    `https://duckduckgo.com/html?q=${encodeURIComponent(query)}`,
    3600,
  )
  const responseText = await response.text()
  try {
    return await matchFirstGroup(responseText, REGEX_DDG_MATCH_URL)
  } catch (e) {
    console.error(e)
    return []
  }
}

async function fetchLinks(event, query) {
  const links = await Promise.all([
    fetchLinksInDuckDuckGo(event, query),
    fetchLinksInGoogle(event, query),
  ])
  const flattenLinks = links.flat()
  const uniqueLinks = [...new Set(flattenLinks)]
  const torrents = await Promise.all(
    uniqueLinks
      .filter((link) => !REGEX_IGNORED_DOMAINS.test(link)) // ignore unwanted words/domains
      .sort((v) => v.match("torrent") ? -1 : 1 )           // priorize links with torrent in their name
      .sort((v) => v.match("free") ? 1 : -1 )              // depriorize links with free in their name
      .map(u => {                                          // fetch magnets in all these sites
        let $ = u
        $ = fetchTorrentsInSite(event, $)
        $ = $.catch(e => {
            console.error(e)
            return []
        })
        return $
      }),
  )
  const torrentLinks = torrents
        .flat()                                           // put all links in the same level
        .map(htmlDecode)                                  // decode urlencoded links
        .sort(t => -t.indexOf("dn="))                     // sort by name
  return [...new Set(torrentLinks)]                       // deduplicate links and return
}

const REGEX_IMDB_MATCH_TITLE = /<title>(.*) - IMDb<\/title>/g
async function getTitleFromIMDB(event, imdbid) {
    try {
        const response = await fetchWithCache(event, `https://www.imdb.com/title/${imdbid}`, 3600*24)
        const responseText = await response.text()
        return htmlDecode(matchFirstGroup(responseText, REGEX_IMDB_MATCH_TITLE)[0])
    } catch (e) {
        console.error(e)
        return imdbid
    }
}

function responseJSON(data = null, statusCode = 200) {
    return new Response(JSON.stringify(data), {
        status: statusCode,
        headers: { 'content-type': 'application/json' },
    })
}

const REGEX_INFOHASH_MATCH = /urn:btih:([^&]*)/g
const REGEX_DN_MATCH = /dn=([^&]*)/g
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(event) {
  const { request } = event
  const reqUrl = new URL(request.url)
  const parts = reqUrl.pathname.split('/').slice(1)
  if (parts.length == 0 || parts[0] == '' || parts[0] == 'index.html') {
    return new Response(homepage, {
      status: 200,
      headers: { 'content-type': 'text/html' },
    })
  }
  if (parts[0] === 'search') {
    const query = reqUrl.searchParams.get('q')
    if (!query) {
      return new Response(null, {
        status: 401,
      })
    }
    const links = await fetchLinks(event, query)
    return responseJSON(links)
  }
  if (parts[0] === 'imdb') {
      const imdbid = reqUrl.searchParams.get('id')
      console.log(imdbid)
      if (!imdbid) {
          return new Response(null, {
              status: 401
          })
      }
      const title = await getTitleFromIMDB(event, imdbid)
      return new Response(JSON.stringify({title}), {
        status: 200,
        headers: {
            'content-type': 'text/html',
            'Access-Control-Allow-Origin': '*'
        },
       })
  }
    if (parts[0] === 'manifest.json') {
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
    if (parts[0] === 'stream') {
        if (parts[1] === 'movie') {
            const name = parts[2]
            const nameParts = name.split('.')
            try {
                const id = nameParts[0]
                const name = await getTitleFromIMDB(event, id)
                const links = await fetchLinks(event, `${name} torrent`)
                const streams = await Promise.all(links.map(link => {
                    const infohashMatch = matchFirstGroup(link, REGEX_INFOHASH_MATCH)
                    const infoHash = infohashMatch[0]
                    const nameMatch = matchFirstGroup(link, REGEX_DN_MATCH)
                    const title = htmlDecode(decodeURIComponent(nameMatch.length > 0 ? nameMatch[0] : '< NO NAME >')).replaceAll('+', ' ')
                    return {infoHash, title}
                }))
                return new Response(JSON.stringify({streams}), {
                    status: 200,
                    headers: {
                        'content-type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                })
            } catch (e) {
                console.error(e)
                return new Response(JSON.stringify({
                    error: e.message || e,
                    streams: []
                }), {
                    status: 200,
                    headers: {
                        'content-type': 'text/html',
                        'Access-Control-Allow-Origin': '*'
                    },
                })
            }
        }
        if (parts[1] === 'series') {
            console.log(parts)
            return new Response(JSON.stringify({streams: []}), {
                status: 200,
                headers: {
                    'content-type': 'text/html',
                    'Access-Control-Allow-Origin': '*'
                },
            })
        }
    }
    if (parts.length >= 2 && parts[0] === 'btdigg' && parts[1].length == 40) {
        const infohash = parts[1]
        const res = await fetchWithCache(event, `https://btdigg.nocensor.biz/${infohash}`, 0, {
            // "credentials": "omit",
            "headers": {
                "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:97.0) Gecko/20100101 Firefox/97.0",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                "Accept-Language": "pt-BR,en-US;q=0.7,en;q=0.3",
                "Upgrade-Insecure-Requests": "1",
                "Sec-Fetch-Dest": "document",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-Site": "none",
                "Sec-Fetch-User": "?1",
                "Cache-Control": "max-age=0"
            },
            "method": "GET",
            // "mode": "cors"
        })
        const text = await res.text()
        // if (text.indexOf("https://www.google.com/recaptcha/api.js")) {
        //     return new Response('bot?', {
        //         status: 200,
        //         headers: {
        //             'content-type': 'text/html',
        //         }
        //     })
        // }
        return new Response(text, {
            status: 200,
            headers: {
                'content-type': 'text/html',
            }
        })
    }
    return new Response(null, {
        status: 404,
    })
}
