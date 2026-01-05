import { describe, it, expect } from 'vitest';
import { isValidHttpUrl } from './url';

describe('isValidHttpUrl', () => {
	it('should return false for bracketed IPv6 loopback address', () => {
		expect(isValidHttpUrl('http://[::1]')).toBe(false);
	});

	it('should return false for "0" and "0.0.0.0" hostnames to prevent SSRF', () => {
		expect(isValidHttpUrl('http://0')).toBe(false);
		expect(isValidHttpUrl('https://0')).toBe(false);
		expect(isValidHttpUrl('http://0.0.0.0')).toBe(false);
		expect(isValidHttpUrl('https://0.0.0.0')).toBe(false);
	});

	it('should return true for valid public IP addresses starting with "0"', () => {
		// This is a valid public IP address and should not be blocked.
		expect(isValidHttpUrl('http://0.1.2.3')).toBe(true);
	});
});
