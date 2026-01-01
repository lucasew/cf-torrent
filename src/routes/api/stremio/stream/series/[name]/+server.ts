import { getTorrentStreams } from '$lib/getTorrentStreams';

export async function GET({ params }) {
	const streams = await getTorrentStreams(params.name);
	return new Response(JSON.stringify({ streams }), {
		headers: {
			'content-type': 'application/json',
			'Access-Control-Allow-Origin': '*'
		}
	});
}
