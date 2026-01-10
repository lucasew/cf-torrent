# Sentinel's Journal - CRITICAL LEARNINGS ONLY
## 2024-05-22 - Stricter IMDB ID Validation
**Vulnerability:** The regex for validating IMDB IDs (`/^tt\d+$/`) was too permissive, allowing for strings of arbitrary length. This could potentially lead to a Regular Expression Denial of Service (ReDoS) attack.
**Learning:** Input validation, even when it seems robust, should always consider edge cases and potential for abuse. In this case, the lack of a length limit was the primary oversight.
**Prevention:** Always enforce reasonable length limits on user-provided input, especially when it is used in regex matching. This is a simple but effective way to prevent ReDoS and other DoS-style attacks.
## 2024-05-23 - SSRF Bypass via Alternative Localhost Representations
**Vulnerability:** The `isValidHttpUrl` function did not block localhost representations like `'0'` or `'0.0.0.0'`, creating a Server-Side Request Forgery (SSRF) vulnerability. An attacker could craft a URL that would cause the server to make a request to itself or other internal services.
**Learning:** SSRF protection must be comprehensive. It's not enough to just block `localhost`; all alternative representations and special IP addresses that resolve to the local machine must also be blocked. The presence of failing unit tests for these bypasses was a clear indicator of the vulnerability and reinforces the value of a strong, security-aware test suite.
**Prevention:** When implementing security filters, especially for SSRF, it's crucial to research and test for common bypass techniques. URL validation logic should be regularly reviewed and updated to include new bypass methods as they become known.

## 2026-01-10 - Sanitize Torrent Display Names to Prevent XSS
**Vulnerability:** An XSS vulnerability was present in the Stremio API. The 'dn' (display name) parameter from externally scraped magnet links was not being sanitized before being included in the API response.
**Learning:** This highlights that any data originating from an external, untrusted source must be treated as hostile. Even data that isn't directly from a user, like scraped magnet link parameters, can be a vector for attack if it's reflected to the client.
**Prevention:** All data from external sources must be sanitized before being returned in an API response. Applying HTML sanitization to the 'dn' parameter ensures that any malicious scripts are neutralized before they can reach the client application.

## 2026-01-10 - Sanitize Torrent Display Names to Prevent XSS
**Vulnerability:** An XSS vulnerability was present in the Stremio API. The 'dn' (display name) parameter from externally scraped magnet links was not being sanitized before being included in the API response.
**Learning:** This highlights that any data originating from an external, untrusted source must be treated as hostile. Even data that isn't directly from a user, like scraped magnet link parameters, can be a vector for attack if it's reflected to the client.
**Prevention:** All data from external sources must be sanitized before being returned in an API response. Applying HTML sanitization to the 'dn' parameter ensures that any malicious scripts are neutralized before they can reach the client application.

## 2026-01-10 - Sanitize Torrent Display Names to Prevent XSS
**Vulnerability:** An XSS vulnerability was present in the Stremio API. The 'dn' (display name) parameter from externally scraped magnet links was not being sanitized before being included in the API response.
**Learning:** This highlights that any data originating from an external, untrusted source must be treated as hostile. Even data that isn't directly from a user, like scraped magnet link parameters, can be a vector for attack if it's reflected to the client.
**Prevention:** All data from external sources must be sanitized before being returned in an API response. Applying HTML sanitization to the 'dn' parameter ensures that any malicious scripts are neutralized before they can reach the client application.
