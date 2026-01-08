import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

export function htmlSanitize(str: string): string {
	return purify.sanitize(str);
}
