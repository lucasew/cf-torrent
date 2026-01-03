import { matchFirstGroup } from './matchFirstGroup';
import { isValidHttpUrl } from './url';

const REGEX_GOOGLE_MATCH_URL = /\/url\\?q=([^"&]*)/g;
export type SearchResult = { link: string; source: 'Google' | 'DuckDuckGo' | 'Yandex' };

async function _search(
	query: string,
	urlTemplate: string,
	regex: RegExp,
	source: SearchResult['source']
): Promise<SearchResult[]> {
	const response = await fetch(urlTemplate.replace('${query}', encodeURIComponent(query)), {
		cf: {
			cacheTtl: 3600,
			cacheEverything: true
		}
	});
	const responseText = await response.text();
	try {
		const urls = await matchFirstGroup(responseText, regex);
		const decodedUrls = [...new Set(urls)].map((url) => decodeURIComponent(url));
		return decodedUrls.filter(isValidHttpUrl).map((url) => ({ link: url, source }));
	} catch (e) {
		console.error(e);
		return [];
	}
}

export async function google(query: string): Promise<SearchResult[]> {
	return _search(
		query,
		'https://www.google.com/search?q=${query}',
		REGEX_GOOGLE_MATCH_URL,
		'Google'
	);
}

const REGEX_DDG_MATCH_URL = /uddg=([^&"]*)/g;
export async function duckduckgo(query: string): Promise<SearchResult[]> {
	return _search(
		query,
		'https://duckduckgo.com/html?q=${query}',
		REGEX_DDG_MATCH_URL,
		'DuckDuckGo'
	);
}

const REGEX_YANDEX_MATCH_URL = /href="(.*?)"/g;
export async function yandex(query: string): Promise<SearchResult[]> {
	return _search(
		query,
		'https://yandex.com/search/?text=${query}',
		REGEX_YANDEX_MATCH_URL,
		'Yandex'
	);
}

export async function combined(query: string) {
	const links = await Promise.all([duckduckgo(query), google(query), yandex(query)]);
	return [...new Set(links.flat())];
}
