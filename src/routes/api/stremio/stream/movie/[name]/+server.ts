import { fetchTorrentsInLinks } from '$lib/fetchTorrentsInLinks';
import { getTitleFromIMDB } from '$lib/getTitleFromIMDB';
import { parseMagnetLink } from '$lib/parseMagnetLink';
import { duckduckgo, google, yandex } from '$lib/search';

export async function GET({ params }) {
	const title = await getTitleFromIMDB(params.name);
	const siteLinks = (
		await Promise.all([google, duckduckgo, yandex].map((f) => f(`${title} torrent`)))
	).flat();
	const links = await fetchTorrentsInLinks(siteLinks);
	return new Response(
		JSON.stringify({
			streams: links.map(parseMagnetLink).filter((x) => x != null)
		}),
		{
			headers: {
				'content-type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			}
		}
	);
}
