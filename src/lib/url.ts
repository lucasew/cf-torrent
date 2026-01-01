/**
 * Checks if a given string is a valid and safe HTTP/HTTPS URL.
 * @param url The URL string to validate.
 * @returns `true` if the URL is valid and safe, `false` otherwise.
 */
export function isValidHttpUrl(url: string): boolean {
	try {
		const parsedUrl = new URL(url);

		// 1. Check for valid protocols
		if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
			return false;
		}

		// 2. Prevent requests to internal or reserved IP addresses
		const ipAddressRegex = /^(127\.|10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|::1|fd[0-9a-f]{2}:)/i;
		if (ipAddressRegex.test(parsedUrl.hostname)) {
			return false;
		}

		return true;
	} catch (e) {
		// URL parsing failed, so it's not a valid URL
		return false;
	}
}
