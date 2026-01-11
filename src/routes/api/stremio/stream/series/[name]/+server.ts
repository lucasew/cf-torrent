import { getTorrentStreams } from '$lib/getTorrentStreams';
import { isValidImdbId } from '$lib/imdb';
import { json } from '$lib/requests';

export async function GET({ params }) {
	if (!isValidImdbId(params.name)) {
		return json({ err: 'Invalid IMDB ID format' }, 400);
	}
	const streams = await getTorrentStreams(params.name);
	return json({ streams });
}
