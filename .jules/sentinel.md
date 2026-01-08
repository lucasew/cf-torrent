# Sentinel's Journal - CRITICAL LEARNINGS ONLY

## 2024-08-05 - Sanitize IMDB Title with Context-Aware Logic
**Vulnerability:** Improper Sanitization of External Data. Movie titles fetched from IMDB were passed to search engines after being processed by a generic HTML sanitizer (`DOMPurify`). This sanitizer, while effective for preventing XSS in rendered HTML, would still allow benign HTML tags (e.g., `<i>`) to pass through, which would then corrupt the search query string.

**Learning:** Sanitization is not a monolithic concept; it must be context-specific.
1.  **Search Query vs. HTML Rendering:** Data intended for a search query must be treated as plain text, requiring the stripping of all HTML tags and decoding of entities. Data intended for rendering in a browser requires XSS protection (like `DOMPurify`), which may preserve safe HTML. Using the wrong tool can lead to corrupted data or security flaws.
2.  **Risk of Regression:** Modifying a security function (like replacing `htmlSanitize`) can introduce new vulnerabilities. It's critical to analyze all call sites of the function to ensure the change doesn't create a new risk (e.g., an XSS vulnerability if the output was also rendered as HTML elsewhere).
3.  **Atomic Commits:** Security patches must be atomic and focused. Including unrelated changes, especially to auto-generated files (like i18n message files), obscures the fix, complicates review, and violates best practices. These must be reverted before submission.

**Prevention:**
- Always choose sanitization methods appropriate for the data's final use case.
- Before modifying a security-related utility function, perform a full impact analysis by checking all its call sites.
- When in doubt, add developer comments (`SECURITY-NOTE`) to clarify the function's expected output and limitations (e.g., "returns plain text, not safe for HTML rendering").
- Strictly review changes before committing to exclude auto-generated or unrelated files. `git restore <file>` is your friend.
