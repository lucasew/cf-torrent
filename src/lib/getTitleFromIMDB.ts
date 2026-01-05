import { htmlSanitize } from './htmlSanitize';
import { matchFirstGroup } from './matchFirstGroup';

const REGEX_IMDB_MATCH_TITLE = /<title>(.*) - IMDb<\/title>/g;
const REGEX_IMDB_ID = /^tt\d+$/;
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
		return htmlSanitize(matchFirstGroup(responseText, REGEX_IMDB_MATCH_TITLE)[0]);
	} catch (e) {
		console.error(e);
		return imdbid;
	}
}
