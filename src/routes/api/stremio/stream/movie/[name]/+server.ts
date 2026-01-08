import { getTorrentStreams } from '$lib/getTorrentStreams';
import { isValidImdbId } from '$lib/imdb';

export async function GET({ params }) {
	if (!isValidImdbId(params.name)) {
		return new Response(JSON.stringify({ error: 'Invalid IMDB ID format' }), {
			status: 400,
			headers: {
				'content-type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			}
		});
	}
	const streams = await getTorrentStreams(params.name);
	return new Response(JSON.stringify({ streams }), {
		headers: {
			'content-type': 'application/json',
			'Access-Control-Allow-Origin': '*'
		}
	});
}
