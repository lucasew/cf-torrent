import { htmlDecode } from './htmlDecode';
import { matchFirstGroup } from './matchFirstGroup';

const REGEX_IMDB_MATCH_TITLE = /<title>(.*) - IMDb<\/title>/g;
const REGEX_IMDB_ID = /^tt\d+$/;
const REGEX_STRIP_HTML = /<[^>]*>?/gm;

/**
 * Fetches a movie title from IMDB and sanitizes it for plain-text use.
 * SECURITY-NOTE: This function strips all HTML and is NOT safe for rendering in HTML.
 * It is intended for use in search queries or other non-HTML contexts.
 * @param imdbid The IMDB ID of the title to fetch.
 * @returns A sanitized, plain-text movie title.
 */
export async function getTitleFromIMDB(imdbid: string) {
	if (!REGEX_IMDB_ID.test(imdbid)) {
		throw new Error(`invalid imdb id format for ${imdbid}`);
	}
	try {
		const response = await fetch(`https://www.imdb.com/title/${imdbid}`, {
			cf: {
				cacheTtl: 3600 * 24,
				cacheEverything: true
			}
		});
		const responseText = await response.text();
		return htmlDecode(
			matchFirstGroup(responseText, REGEX_IMDB_MATCH_TITLE)[0].replace(REGEX_STRIP_HTML, '')
		);
	} catch (e) {
		console.error(e);
		return imdbid;
	}
}
