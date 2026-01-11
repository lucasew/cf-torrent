# Sentinel's Journal - CRITICAL LEARNINGS ONLY
## 2024-05-22 - Stricter IMDB ID Validation
**Vulnerability:** The regex for validating IMDB IDs (`/^tt\d+$/`) was too permissive, allowing for strings of arbitrary length. This could potentially lead to a Regular Expression Denial of Service (ReDoS) attack.
**Learning:** Input validation, even when it seems robust, should always consider edge cases and potential for abuse. In this case, the lack of a length limit was the primary oversight.
**Prevention:** Always enforce reasonable length limits on user-provided input, especially when it is used in regex matching. This is a simple but effective way to prevent ReDoS and other DoS-style attacks.
## 2024-05-23 - SSRF Bypass via Alternative Localhost Representations
**Vulnerability:** The `isValidHttpUrl` function did not block localhost representations like `'0'` or `'0.0.0.0'`, creating a Server-Side Request Forgery (SSRF) vulnerability. An attacker could craft a URL that would cause the server to make a request to itself or other internal services.
**Learning:** SSRF protection must be comprehensive. It's not enough to just block `localhost`; all alternative representations and special IP addresses that resolve to the local machine must also be blocked. The presence of failing unit tests for these bypasses was a clear indicator of the vulnerability and reinforces the value of a strong, security-aware test suite.
**Prevention:** When implementing security filters, especially for SSRF, it's crucial to research and test for common bypass techniques. URL validation logic should be regularly reviewed and updated to include new bypass methods as they become known.
## 2024-05-24 - Sanitize IMDB Title to Prevent Reflected XSS
**Vulnerability:** The movie title fetched from IMDB was used directly in search queries without sanitization. If a malicious actor could manipulate the title on the IMDB page to include HTML script tags, this could lead to a reflected XSS attack when the search results were rendered.
**Learning:** All external data, even from seemingly trusted sources like IMDB, must be treated as untrusted. Failing to sanitize this data before using it in dynamic queries or rendering it on a page can introduce security vulnerabilities.
**Prevention:** Always sanitize external data at the point where it enters the system and before it is used. In this case, stripping HTML tags from the movie title before it's used in the search query is an effective mitigation.
