import { matchFirstGroup } from './matchFirstGroup';
import { isValidHttpUrl } from './url';

const REGEX_GOOGLE_MATCH_URL = /\/url\\?q=([^"&]*)/g;
export type SearchResult = { link: string; source: 'Google' | 'DuckDuckGo' | 'Yandex' };

async function _search(
	source: SearchResult['source'],
	url: string,
	regex: RegExp,
	isDdg = false
): Promise<SearchResult[]> {
	const response = await fetch(url, {
		cf: {
			cacheTtl: 3600,
			cacheEverything: true
		}
	});
	const responseText = await response.text();
	try {
		const urls = await matchFirstGroup(responseText, regex);
		let decodedUrls = urls.map((url) => decodeURIComponent(url));
		if (isDdg) {
			decodedUrls = [...new Set(decodedUrls)];
		}
		return decodedUrls.filter(isValidHttpUrl).map((url) => ({ link: url, source }));
	} catch (e) {
		console.error(e);
		return [];
	}
}

export async function google(query: string): Promise<SearchResult[]> {
	return _search(
		'Google',
		`https://www.google.com/search?q=${encodeURIComponent(query)}`,
		REGEX_GOOGLE_MATCH_URL
	);
}

const REGEX_DDG_MATCH_URL = /uddg=([^&"]*)/g;
export async function duckduckgo(query: string): Promise<SearchResult[]> {
	return _search(
		'DuckDuckGo',
		`https://duckduckgo.com/html?q=${encodeURIComponent(query)}`,
		REGEX_DDG_MATCH_URL,
		true
	);
}

const REGEX_YANDEX_MATCH_URL = /href="(.*?)"/g;
export async function yandex(query: string): Promise<SearchResult[]> {
	return _search(
		'Yandex',
		`https://yandex.com/search/?text=${encodeURIComponent(query)}`,
		REGEX_YANDEX_MATCH_URL
	);
}

export async function combined(query: string) {
	const links = await Promise.all([duckduckgo(query), google(query), yandex(query)]);
	return [...new Set(links.flat())];
}
