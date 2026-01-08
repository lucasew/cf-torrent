# Sentinel's Journal - CRITICAL LEARNINGS ONLY
## 2024-05-23 - Prevent SSRF via '0' Hostname Bypass
**Vulnerability:** Server-Side Request Forgery (SSRF) in `isValidHttpUrl` function.
**Learning:** The `isValidHttpUrl` function did not properly validate hostnames like "0" or "0.0.0.0", which can resolve to the local machine. This would allow an attacker to bypass the SSRF protection and make requests to internal services.
**Prevention:** Always ensure that URL validation functions explicitly block all representations of localhost and private IP addresses, including "0", "0.0.0.0", and "[::]", to prevent SSRF vulnerabilities.
