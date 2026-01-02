import { describe, it, expect } from 'vitest';
import { isValidHttpUrl } from './lib/url';

describe('URL Validation', () => {
	it('should return true for valid http and https URLs', () => {
		expect(isValidHttpUrl('http://example.com')).toBe(true);
		expect(isValidHttpUrl('https://example.com')).toBe(true);
		expect(isValidHttpUrl('https://www.google.com/search?q=test')).toBe(true);
	});

	it('should return false for invalid URLs', () => {
		expect(isValidHttpUrl('javascript:alert(1)')).toBe(false);
		expect(isValidHttpUrl('ftp://example.com')).toBe(false);
		expect(isValidHttpUrl('ws://example.com')).toBe(false);
		expect(isValidHttpUrl('http://127.0.0.1')).toBe(false);
		expect(isValidHttpUrl('http://localhost')).toBe(false);
	});
});
