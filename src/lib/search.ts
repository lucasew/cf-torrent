import { matchFirstGroup } from "./matchFirstGroup"

const REGEX_GOOGLE_MATCH_URL = /\/url\\?q=([^"&]*)/g
export async function google(query: string) {
  const response = await fetch(`https://www.google.com/search?q=${encodeURIComponent(query)}`, {
    cf: {
        cacheTtl: 3600,
        cacheEverything: true
    }
  })
  const responseText = await response.text()
  try {
    return await matchFirstGroup(responseText, REGEX_GOOGLE_MATCH_URL)
  } catch (e) {
    console.error(e)
    return []
  }
}

const REGEX_DDG_MATCH_URL = /uddg=([^&"]*)/g
export async function duckduckgo(query: string) {
  const response = await fetch(`https://duckduckgo.com/html?q=${encodeURIComponent(query)}`, {
    cf: {
        cacheTtl: 3600,
        cacheEverything: true
    }
  })
  const responseText = await response.text()
  try {
    return [...new Set(await matchFirstGroup(responseText, REGEX_DDG_MATCH_URL))]
  } catch (e) {
    console.error(e)
    return []
  }
}

export async function combined(query: string) {
  const links = await Promise.all([
    duckduckgo(query),
    google(query),
  ])
  return [...new Set(links.flat())]
}