import { describe, expect, it } from 'vitest';
import { isValidHttpUrl } from './url';

describe('isValidHttpUrl', () => {
	it('should return false for encoded localhost URLs', () => {
		const encodedUrl =
			'http://%31%32%37%2e%30%2e%30%2e%31'; // http://127.0.0.1
		expect(isValidHttpUrl(encodedUrl)).toBe(false);
	});

	it('should return false for the "0" null route IP address', () => {
		const url = 'http://0/';
		expect(isValidHttpUrl(url)).toBe(false);
	});
});
