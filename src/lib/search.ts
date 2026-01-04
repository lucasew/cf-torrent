import { matchFirstGroup } from './matchFirstGroup';
import { isValidHttpUrl } from './url';

export type SearchResult = { link: string; source: 'Google' | 'DuckDuckGo' | 'Yandex' };

type SearchEngine = 'Google' | 'DuckDuckGo' | 'Yandex';

async function _search(
	searchUrl: string,
	regex: RegExp,
	source: SearchEngine
): Promise<SearchResult[]> {
	const response = await fetch(searchUrl, {
		cf: {
			cacheTtl: 3600,
			cacheEverything: true
		}
	});
	const responseText = await response.text();
	try {
		const urls = await matchFirstGroup(responseText, regex);
		const decodedUrls = [...new Set(urls)].map((url) => decodeURIComponent(url));
		return decodedUrls.filter(isValidHttpUrl).map((link) => ({ link, source }));
	} catch (e) {
		console.error(e);
		return [];
	}
}

const REGEX_GOOGLE_MATCH_URL = /\/url\\?q=([^"&]*)/g;
export async function google(query: string): Promise<SearchResult[]> {
	const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
	return _search(url, REGEX_GOOGLE_MATCH_URL, 'Google');
}

const REGEX_DDG_MATCH_URL = /uddg=([^&"]*)/g;
export async function duckduckgo(query: string): Promise<SearchResult[]> {
	const url = `https://duckduckgo.com/html?q=${encodeURIComponent(query)}`;
	return _search(url, REGEX_DDG_MATCH_URL, 'DuckDuckGo');
}

const REGEX_YANDEX_MATCH_URL = /href="(.*?)"/g;
export async function yandex(query: string): Promise<SearchResult[]> {
	const url = `https://yandex.com/search/?text=${encodeURIComponent(query)}`;
	return _search(url, REGEX_YANDEX_MATCH_URL, 'Yandex');
}

export async function combined(query: string) {
	const links = await Promise.all([duckduckgo(query), google(query), yandex(query)]);
	return [...new Set(links.flat())];
}
