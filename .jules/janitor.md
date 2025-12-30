## 2024-08-16 - Avoid Modifying Auto-Generated Code
**Issue:** A pull request included both a manual bug fix and large-scale changes to auto-generated files located in the `src/lib/paraglide/` directory.

**Root Cause:** The `paraglide-js compile` command, which runs automatically on `bun install`, modified i18n message files. These changes were unintentionally staged and bundled with a focused, manual code quality fix.

**Solution:** The auto-generated files were reverted to their original state using `git restore <file>`. The final commit exclusively contained the intended, hand-written change.

**Pattern:** The `paraglide` directory contains machine-generated code and should not be modified by hand. Always check the full `git diff` before committing to ensure that build artifacts or other auto-generated files are not included with manual changes. Keep commits small, focused, and authored by a human.