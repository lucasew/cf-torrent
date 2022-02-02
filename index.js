import homepage from './index.html.in'

const {decode: htmlDecode} = require('he')

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
  return torrentLinks
}

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(event) {
  const { request } = event
  const reqUrl = new URL(request.url)
  if (reqUrl.pathname === '/search') {
    const query = reqUrl.searchParams.get('q')
    if (!query) {
      return new Response(null, {
        status: 401,
      })
    }
    const links = await fetchLinks(event, query)
    return new Response(JSON.stringify(links), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  }
  if (reqUrl.pathname === '/') {
    return new Response(homepage, {
      status: 200,
      headers: { 'content-type': 'text/html' },
    })
  }
  return new Response(null, {
    status: 404,
  })
}
