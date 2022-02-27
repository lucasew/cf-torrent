import homepage from './index.html.in'

const {decode: htmlDecode} = require('he')

const packagejson = require('./package.json')

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event))
})

async function fetchWithCache(event, _url, cacheTTL) {
  const url = new URL(_url)
  const cache = caches.default
  let response = await cache.match(_url)
  if (!response) {
    console.log(
      `Response for request url '${url.toString()}' not present in cache. Fetching...`,
    )
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 2000)
    response = await fetch(_url, {
      signal: controller.signal,
    }).finally(v => {
      clearTimeout(timeout)
      return v
    })
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

async function fetchTorrentsInSite(event, url) {
  const response = await fetchWithCache(event, url, 2 * 3600)
  const text = await response.text()
  return matchFirstGroup(text, `(magnet:[^"' ]*)`)
}

async function fetchLinksInGoogle(event, query) {
  const response = await fetchWithCache(
    event,
    `https://www.google.com/search?q=${encodeURIComponent(query)}`,
    3600,
  )
  const responseText = await response.text()
  try {
    return matchFirstGroup(responseText, `\/url\\?q=([^"&]*)`)
  } catch (e) {
    console.error(e)
    return []
  }
}

async function fetchLinksInDuckDuckGo(event, query) {
  const response = await fetchWithCache(
    event,
    `https://duckduckgo.com/html?q=${encodeURIComponent(query)}`,
    3600,
  )
  const responseText = await response.text()
  try {
    return await matchFirstGroup(responseText, `uddg=([^&"]*)`)
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
    uniqueLinks.map(u => {
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
        .flat()
        .map(htmlDecode)
        .sort(t => -t.indexOf("dn="))
  return [...new Set(torrentLinks)]
}

async function getTitleFromIMDB(event, imdbid) {
    try {
        const response = await fetchWithCache(event, `https://www.imdb.com/title/${imdbid}`, 3600*24)
        const responseText = await response.text()
        return htmlDecode(matchFirstGroup(responseText, `<title>(.*) - IMDb</title>`)[0])
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
                    types: [ 'movie' ],
                    idPrefixes: [ 'tt' ]
                }
            ],
            types: [ 'movie' ],
        }), {
            status: 200,
            headers: {
                'content-type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
        })
    }
    if (parts[0] === 'stream' && parts[1] === 'movie') {
        const name = parts[2]
        const nameParts = name.split('.')
        try {
            const id = nameParts[0]
            const name = await getTitleFromIMDB(event, id)
            const links = await fetchLinks(event, `${name} torrent`)
            const streams = await Promise.all(links.map(link => {
                const infohashMatch = matchFirstGroup(link, `urn:btih:([^&]*)`)
                const infoHash = infohashMatch[0]
                const nameMatch = matchFirstGroup(link, `dn=([^&]*)`)
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
            return new Response(JSON.stringify({streams}), {
                status: 200,
                headers: {
                    'content-type': 'text/html',
                    'Access-Control-Allow-Origin': '*'
                },
            })
        }
    }
    return new Response(null, {
        status: 404,
    })
}
