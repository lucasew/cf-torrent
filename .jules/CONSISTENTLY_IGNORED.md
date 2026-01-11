# Consistently Ignored Changes

This file lists patterns of changes that have been consistently rejected by human reviewers. All agents MUST consult this file before proposing a new change. If a planned change matches any pattern described below, it MUST be abandoned.

---
## IGNORE: Broad Sanitization of Torrent Data

**- Pattern:** Do not apply broad HTML sanitization to the entire torrent title or magnet link.
**- Justification:** Overly aggressive sanitization can corrupt legitimate torrent data and magnet links. Changes that sanitize the entire torrent object have been rejected. The correct approach is to selectively sanitize specific, user-controllable fields, such as the `dn` (display name) parameter in magnet links, just before they are rendered in the UI.
**- Files Affected:** `src/lib/getTorrentStreams.ts`
