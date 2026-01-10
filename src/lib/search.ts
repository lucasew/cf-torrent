import { matchFirstGroup } from './matchFirstGroup';
import { isValidHttpUrl } from './url';

const SEARCH_ENGINES = {
	Google: {
		urlTemplate: 'https://www.google.com/search?q=',
		regex: /\/url\\?q=([^"&]*)/g
	},
	DuckDuckGo: {
		urlTemplate: 'https://duckduckgo.com/html?q=',
		regex: /uddg=([^&"]*)/g
	},
	Yandex: {
		urlTemplate: 'https://yandex.com/search/?text=',
		regex: /href="(.*?)"/g
	}
};

type SearchEngine = keyof typeof SEARCH_ENGINES;
export type SearchResult = { link: string; source: SearchEngine };

async function _search(query: string, source: SearchEngine): Promise<SearchResult[]> {
	const config = SEARCH_ENGINES[source];
	const response = await fetch(`${config.urlTemplate}${encodeURIComponent(query)}`, {
		cf: {
			cacheTtl: 3600,
			cacheEverything: true
		}
	});
	const responseText = await response.text();
	try {
		const urls = await matchFirstGroup(responseText, config.regex);
		const decodedUrls = [...new Set(urls)].map((url) => decodeURIComponent(url));
		return decodedUrls.filter(isValidHttpUrl).map((url) => ({ link: url, source }));
	} catch (e) {
		console.error(e);
		return [];
	}
}

export function google(query: string): Promise<SearchResult[]> {
	return _search(query, 'Google');
}

export function duckduckgo(query: string): Promise<SearchResult[]> {
	return _search(query, 'DuckDuckGo');
}

export function yandex(query: string): Promise<SearchResult[]> {
	return _search(query, 'Yandex');
}

export async function combined(query: string) {
	const links = await Promise.all([duckduckgo(query), google(query), yandex(query)]);
	return [...new Set(links.flat())];
}
