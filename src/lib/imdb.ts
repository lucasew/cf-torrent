const REGEX_IMDB_ID = /^tt\d+$/;

export function isValidImdbId(id: string): boolean {
	return REGEX_IMDB_ID.test(id);
}
