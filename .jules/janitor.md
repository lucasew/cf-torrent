## 2024-05-23 - Unintended Changes to Auto-Generated Files
**Issue:** A pull request with a small, focused fix also contained large, unrelated changes to an auto-generated file (`src/lib/paraglide/messages/_index.js`).
**Root Cause:** Running `bun install` or other build-related commands can trigger scripts (like `paraglide-js compile`) that modify auto-generated files based on the current environment or dependencies. These changes are not part of the intended fix.
**Solution:** After running any installation or build commands, carefully review the changed files. Revert any unintended modifications to auto-generated files before committing.
**Pattern:** Auto-generated files, especially in i18n libraries like `paraglide-js`, are sensitive to the build environment. Always revert changes to these files if they are not directly related to the task at hand to keep commits small, focused, and reviewable.

## 2024-07-24 - Exclude Non-Code Directories from Linting
**Issue:** The `bun lint` command was failing because `prettier` was attempting to format files in the `.jules/` directory, which contains markdown files for agent journals, not application code. This caused unnecessary CI failures and developer friction.
**Root Cause:** The `.prettierignore` file did not include the `.jules/` directory, so the linting script was checking all files in the repository, including non-code files.
**Solution:** I added `.jules/` to the `.prettierignore` file. This tells `prettier` to skip this directory, ensuring the linting process only focuses on actual source code.
**Pattern:** Configure linting and formatting tools to ignore non-code directories like `.jules/`, `.github/`, or documentation folders. This prevents tool-related noise and ensures that CI checks are focused on code quality.
