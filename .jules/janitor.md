## 2024-05-23 - Unintended Changes to Auto-Generated Files
**Issue:** A pull request with a small, focused fix also contained large, unrelated changes to an auto-generated file (`src/lib/paraglide/messages/_index.js`).
**Root Cause:** Running `bun install` or other build-related commands can trigger scripts (like `paraglide-js compile`) that modify auto-generated files based on the current environment or dependencies. These changes are not part of the intended fix.
**Solution:** After running any installation or build commands, carefully review the changed files. Revert any unintended modifications to auto-generated files before committing.
**Pattern:** Auto-generated files, especially in i18n libraries like `paraglide-js`, are sensitive to the build environment. Always revert changes to these files if they are not directly related to the task at hand to keep commits small, focused, and reviewable.

## 2024-05-24 - Consolidate Search Engine Configuration
**Issue:** In `src/lib/search.ts`, the configuration for different search engines (URL templates and regexes) was scattered as individual constants. This made the code harder to read and maintain.
**Root Cause:** The code was likely written by adding one search engine at a time, leading to a fragmented configuration.
**Solution:** I grouped all related constants for each search engine into a single, structured `SEARCH_ENGINES` object. This makes it easier to add, remove, or modify search engine settings in the future.
**Pattern:** Configuration data for a set of related items (like different API providers or, in this case, search engines) should be grouped into a structured object or map. This improves readability, simplifies maintenance, and reduces the chance of errors.
