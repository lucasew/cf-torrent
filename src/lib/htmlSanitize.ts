export function htmlSanitize(str: string): string {
	return str.replace(/<[^>]*>?/gm, '');
}
