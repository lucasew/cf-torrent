import { matchFirstGroup } from './matchFirstGroup';
import { isValidHttpUrl } from './url';

export type SearchResult = { link: string; source: 'Google' | 'DuckDuckGo' | 'Yandex' };
type SearchEngine = 'Google' | 'DuckDuckGo' | 'Yandex';

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

async function _search(
	query: string,
	urlTemplate: string,
	regex: RegExp,
	source: SearchEngine
): Promise<SearchResult[]> {
	const response = await fetch(`${urlTemplate}${encodeURIComponent(query)}`, {
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

export function google(query: string): Promise<SearchResult[]> {
	const engine = SEARCH_ENGINES['Google'];
	return _search(query, engine.urlTemplate, engine.regex, 'Google');
}

export function duckduckgo(query: string): Promise<SearchResult[]> {
	const engine = SEARCH_ENGINES['DuckDuckGo'];
	return _search(query, engine.urlTemplate, engine.regex, 'DuckDuckGo');
}

export function yandex(query: string): Promise<SearchResult[]> {
	const engine = SEARCH_ENGINES['Yandex'];
	return _search(query, engine.urlTemplate, engine.regex, 'Yandex');
}

export async function combined(query: string) {
	const links = await Promise.all([duckduckgo(query), google(query), yandex(query)]);
	return [...new Set(links.flat())];
}
