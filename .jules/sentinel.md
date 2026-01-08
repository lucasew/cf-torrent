# Sentinel's Journal - CRITICAL LEARNINGS ONLY
## 2024-05-22 - Stricter IMDB ID Validation
**Vulnerability:** The regex for validating IMDB IDs (`/^tt\d+$/`) was too permissive, allowing for strings of arbitrary length. This could potentially lead to a Regular Expression Denial of Service (ReDoS) attack.
**Learning:** Input validation, even when it seems robust, should always consider edge cases and potential for abuse. In this case, the lack of a length limit was the primary oversight.
**Prevention:** Always enforce reasonable length limits on user-provided input, especially when it is used in regex matching. This is a simple but effective way to prevent ReDoS and other DoS-style attacks.
