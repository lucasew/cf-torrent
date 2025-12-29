# Janitor's Journal

## 2024-09-05 - Build process modifies tracked source files
**Issue:** Running `bun install` triggered a `postinstall` script that modified auto-generated internationalization (i18n) files in the `src/lib/paraglide/` directory. These files are tracked by Git, leading to unintended changes being included in the commit.
**Root Cause:** The `paraglide-js compile` command overwrites existing files with compiled output. Because these files are tracked in source control, the modifications appeared as part of my code changes.
**Solution:** The unintended changes to the auto-generated files were reverted before submitting the pull request.
**Pattern:** Always review the full diff before committing to ensure that no unintended changes from build tools or scripts are included. Auto-generated files that are frequently modified by tooling should ideally be added to `.gitignore` or handled as build artifacts. Since they are tracked in this project, I must be careful not to commit tool-generated modifications to them.
