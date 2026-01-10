export function json(data: unknown, status = 200): Response {
	return new Response(JSON.stringify(data), {
		status,
		headers: {
			'content-type': 'application/json',
			'Access-Control-Allow-Origin': '*'
		}
	});
}
