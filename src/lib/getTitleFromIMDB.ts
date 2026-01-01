import { htmlDecode } from './htmlDecode';
import { matchFirstGroup } from './matchFirstGroup';

const REGEX_IMDB_MATCH_TITLE = /<title>(.*) - IMDb<\/title>/g;
export const REGEX_IMDB_ID = /^tt\d{7,8}$/;

export async function getTitleFromIMDB(imdbid: string) {
	if (!REGEX_IMDB_ID.test(imdbid)) {
		return imdbid;
	}
	try {
		const response = await fetch(`https://www.imdb.com/title/${imdbid}`, {
			cf: {
				cacheTtl: 3600 * 24,
				cacheEverything: true
			}
		});
		const responseText = await response.text();
		return htmlDecode(matchFirstGroup(responseText, REGEX_IMDB_MATCH_TITLE)[0]);
	} catch (e) {
		console.error(e);
		return imdbid;
	}
}
