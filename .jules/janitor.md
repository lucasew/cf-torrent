## 2024-05-23 - Unintended Changes to Auto-Generated Files
**Issue:** A pull request with a small, focused fix also contained large, unrelated changes to an auto-generated file (`src/lib/paraglide/messages/_index.js`).
**Root Cause:** Running `bun install` or other build-related commands can trigger scripts (like `paraglide-js compile`) that modify auto-generated files based on the current environment or dependencies. These changes are not part of the intended fix.
**Solution:** After running any installation or build commands, carefully review the changed files. Revert any unintended modifications to auto-generated files before committing.
**Pattern:** Auto-generated files, especially in i18n libraries like `paraglide-js`, are sensitive to the build environment. Always revert changes to these files if they are not directly related to the task at hand to keep commits small, focused, and reviewable.

## 2024-05-24 - Consolidate Scattered Configuration
**Issue:** Configuration data for different search engines (URL templates, regex patterns) was scattered across multiple functions in `src/lib/search.ts`. This led to code duplication and made it cumbersome to add, remove, or modify search providers.
**Root Cause:** The initial implementation likely evolved by adding one search engine at a time, resulting in separate, hardcoded constants within each new function rather than a unified configuration structure.
**Solution:** I refactored the code to define a single `SEARCH_ENGINES` object. This object acts as a centralized registry, mapping each search engine's name to its specific configuration (URL template and regex). The individual search functions were then simplified to look up their configuration from this object.
**Pattern:** For related entities (like different providers, themes, or feature flags) that share a common data structure, group their configuration into a single, structured object or map. This improves code organization, reduces boilerplate, and makes the system more scalable and maintainable.

## 2024-07-24 - Exclude Non-Code Directories from Linting
**Issue:** The `bun lint` command was failing because `prettier` was attempting to format files in the `.jules/` directory, which contains markdown files for agent journals, not application code. This caused unnecessary CI failures and developer friction.
**Root Cause:** The `.prettierignore` file did not include the `.jules/` directory, so the linting script was checking all files in the repository, including non-code files.
**Solution:** I added `.jules/` to the `.prettierignore` file. This tells `prettier` to skip this directory, ensuring the linting process only focuses on actual source code.
**Pattern:** Configure linting and formatting tools to ignore non-code directories like `.jules/`, `.github/`, or documentation folders. This prevents tool-related noise and ensures that CI checks are focused on code quality.

## 2024-07-25 - Remove Redundant Abstraction
**Issue:** The codebase contained a file `src/lib/htmlDecode.ts` that only re-exported the `decode` function from the `he` library. This created an unnecessary layer of abstraction and added an extra file to the project for no real benefit.
**Root Cause:** This might have been created with the intention of abstracting away the `he` library in case it needed to be replaced in the future, but for a simple function like this, it just adds clutter.
**Solution:** I removed the `htmlDecode.ts` file and updated the only file that used it (`src/lib/fetchTorrentsInLinks.ts`) to import and use `he.decode` directly.
**Pattern:** Avoid creating thin wrappers or re-exporting single functions from libraries if the wrapper doesn't add any new logic or a more meaningful name. Using the library directly simplifies the codebase and reduces the number of files to maintain.
