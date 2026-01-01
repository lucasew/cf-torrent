## 2024-07-23 - Centralize Magnet Link Parsing

**Issue:** The magnet link parsing logic, including validation and extraction of the `infoHash`, was duplicated in both the movie and series Stremio API endpoints. This included the use of a magic number (`40`) for the `infoHash` length, making the code harder to maintain and prone to inconsistencies.

**Root Cause:** The logic was likely written inline for the first endpoint and then copied and pasted to the second, without considering the possibility of abstracting it into a reusable function.

**Solution:** I extracted the duplicated logic into a single function, `parseMagnetLink`, in a new file `src/lib/parseMagnetLink.ts`. This function now handles the parsing and validation of magnet links, and the magic number `40` has been replaced with a named constant `INFO_HASH_LENGTH`. Both the movie and series endpoints now call this single function, reducing code duplication and improving readability.

**Pattern:** When the same data parsing and validation logic is needed in multiple places, centralize it in a single, reusable function. This improves maintainability, reduces the chance of errors, and makes the code easier to understand. Always replace magic numbers with named constants to improve clarity and ease of future updates.
