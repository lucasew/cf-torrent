// IMDB IDs are typically 7-8 digits, allowing up to 12 for future-proofing and preventing DoS.
const REGEX_IMDB_ID = /^tt\d{7,12}$/;

export function isValidImdbId(id: string): boolean {
	return REGEX_IMDB_ID.test(id);
}
