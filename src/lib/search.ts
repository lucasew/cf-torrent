import { matchFirstGroup } from "./matchFirstGroup"

const REGEX_GOOGLE_MATCH_URL = /\/url\\?q=([^"&]*)/g
export type SearchResult = { link: string; source: 'Google' | 'DuckDuckGo' | 'Yandex' };
export async function google(query: string): Promise<SearchResult[]> {
  const response = await fetch(
    `https://www.google.com/search?q=${encodeURIComponent(query)}`,
    {
    cf: {
        cacheTtl: 3600,
        cacheEverything: true
    }
  })
  const responseText = await response.text()
  try {
    const urls = await matchFirstGroup(responseText, REGEX_GOOGLE_MATCH_URL);
    // Map to SearchResult with source tag
    return urls.map((url) => ({ link: url, source: 'Google' }));
  } catch (e) {
    console.error(e);
    return [];
  }
}

const REGEX_DDG_MATCH_URL = /uddg=([^&"]*)/g
export async function duckduckgo(query: string): Promise<SearchResult[]> {
  const response = await fetch(
    `https://duckduckgo.com/html?q=${encodeURIComponent(query)}`,
    {
    cf: {
        cacheTtl: 3600,
        cacheEverything: true
    }
  })
  const responseText = await response.text()
  try {
    const urls = await matchFirstGroup(responseText, REGEX_DDG_MATCH_URL);
    // Unique and map to SearchResult with source tag
    return [...new Set(urls)].map((url) => ({ link: url, source: 'DuckDuckGo' }));
  } catch (e) {
    console.error(e);
    return [];
  }
}

// Placeholder Yandex search: URL and regex to extract links
const REGEX_YANDEX_MATCH_URL = /href="(.*?)"/g
export async function yandex(query: string): Promise<SearchResult[]> {
  const response = await fetch(
    `https://yandex.com/search/?text=${encodeURIComponent(query)}`,
    {
    cf: {
        cacheTtl: 3600,
        cacheEverything: true
    }
  })
  const responseText = await response.text()
  try {
    const urls = await matchFirstGroup(responseText, REGEX_YANDEX_MATCH_URL)
    return urls.map((url) => ({ link: url, source: 'Yandex' }))
  } catch (e) {
    console.error(e)
    return []
  }
}

export async function combined(query: string) {
  const links = await Promise.all([
    duckduckgo(query),
    google(query),
    yandex(query),
  ])
  return [...new Set(links.flat())]
}
