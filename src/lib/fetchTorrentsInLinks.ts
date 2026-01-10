import { fetchTorrentsInSite } from './fetchTorrentsInSite';
import he from 'he';
import { rankLinks } from './rankLinks';

export async function fetchTorrentsInLinks(links: string[]) {
	const sortedLinks = rankLinks(links);
	const fetched = await Promise.all(sortedLinks.map((t) => fetchTorrentsInSite(t).catch(() => [])));
	const fetchedProcessed = fetched
		.flat()
		.map((x) => he.decode(x))
		.sort((t) => -t.indexOf('dn='));
	return [...new Set(fetchedProcessed)];
}
