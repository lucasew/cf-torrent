import { deLocalizeUrl } from '$lib/paraglide/runtime';
import type { Reroute } from '@sveltejs/g';

export const reroute: Reroute = (request) => {
	return deLocalizeUrl(request.url).pathname;
};
