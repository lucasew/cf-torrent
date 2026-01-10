# Sentinel's Journal - CRITICAL LEARNINGS ONLY
## 2024-05-22 - Stricter IMDB ID Validation
**Vulnerability:** The regex for validating IMDB IDs (`/^tt\d+$/`) was too permissive, allowing for strings of arbitrary length. This could potentially lead to a Regular Expression Denial of Service (ReDoS) attack.
**Learning:** Input validation, even when it seems robust, should always consider edge cases and potential for abuse. In this case, the lack of a length limit was the primary oversight.
**Prevention:** Always enforce reasonable length limits on user-provided input, especially when it is used in regex matching. This is a simple but effective way to prevent ReDoS and other DoS-style attacks.
## 2024-05-23 - SSRF Bypass via Alternative Localhost Representations
**Vulnerability:** The `isValidHttpUrl` function did not block localhost representations like `'0'` or `'0.0.0.0'`, creating a Server-Side Request Forgery (SSRF) vulnerability. An attacker could craft a URL that would cause the server to make a request to itself or other internal services.
**Learning:** SSRF protection must be comprehensive. It's not enough to just block `localhost`; all alternative representations and special IP addresses that resolve to the local machine must also be blocked. The presence of failing unit tests for these bypasses was a clear indicator of the vulnerability and reinforces the value of a strong, security-aware test suite.
**Prevention:** When implementing security filters, especially for SSRF, it's crucial to research and test for common bypass techniques. URL validation logic should be regularly reviewed and updated to include new bypass methods as they become known.

## 2026-01-10 - XSS in Magnet Link Display Name
**Vulnerability:** The 'dn' (display name) parameter from magnet links was used directly in the API response without sanitization, creating a Cross-Site Scripting (XSS) vulnerability.
**Learning:** Untrusted data from external sources, especially URLs, must always be sanitized before being returned in an API response. The 'dn' parameter of a magnet link is user-controllable and can be a vector for malicious scripts.
**Prevention:** Always use a reputable HTML sanitization library on any data that originates from an external source and will be rendered by a client application. This prevents attackers from injecting scripts that can compromise user sessions or data.
