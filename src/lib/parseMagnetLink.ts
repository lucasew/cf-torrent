const INFO_HASH_LENGTH = 40;

export function parseMagnetLink(link: string): { infoHash: string; title: string } | null {
	try {
		const parsedURL = new URL(link);
		let infoHash = parsedURL.searchParams.get('xt');
		if (infoHash) {
			infoHash = infoHash.replace('urn:', '').replace('btih:', '');
		}
		if (!infoHash || infoHash.length !== INFO_HASH_LENGTH) {
			return null;
		}
		const title = parsedURL.searchParams.get('dn') || '(NO NAME)';
		return { infoHash, title };
	} catch (e) {
		return null;
	}
}
