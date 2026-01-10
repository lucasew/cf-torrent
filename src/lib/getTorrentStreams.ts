import { fetchTorrentsInLinks } from '$lib/fetchTorrentsInLinks';
import { getTitleFromIMDB } from '$lib/getTitleFromIMDB';
import { htmlSanitize } from '$lib/htmlSanitize';
import { htmlSanitize } from '$lib/htmlSanitize';
import { htmlSanitize } from '$lib/htmlSanitize';
import { duckduckgo, google, yandex } from '$lib/search';

interface TorrentStream {
	infoHash: string;
	title: string;
}

export async function getTorrentStreams(imdbId: string): Promise<TorrentStream[]> {
	const title = await getTitleFromIMDB(imdbId);
	const siteLinks = (
		await Promise.all(
			[google, duckduckgo, yandex].map((f) => f(`${encodeURIComponent(title)} torrent`))
		)
	).flat();
	const links = await fetchTorrentsInLinks(siteLinks);
	return links
		.map((link): TorrentStream | null => {
			const parsedURL = new URL(link);
			let infoHash = parsedURL.searchParams.get('xt');
			if (infoHash) {
				infoHash = infoHash.replace('urn:', '').replace('btih:', '');
			}
			if (!infoHash || infoHash.length != 40) {
				return null;
			}
			const title = htmlSanitize(parsedURL.searchParams.get('dn') || '(NO NAME)');
			return { infoHash, title };
		})
		.filter((stream): stream is TorrentStream => stream !== null);
}
