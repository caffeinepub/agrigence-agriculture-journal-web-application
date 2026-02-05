# Specification

## Summary
**Goal:** Add a complete, offline-ready static website bundle (HTML/CSS/JS/assets) that runs by double-clicking `index.html`, with no server and no network access required.

**Planned changes:**
- Create a new standalone folder in the repository containing an offline site bundle with: `index.html`, `/css`, `/js`, `/assets`, `/images`, and `/fonts`.
- Ensure all CSS/JS/images/fonts/videos are referenced via relative paths only (no absolute paths, no localhost URLs).
- Avoid all CDN dependencies; include any third-party libraries, icons, and fonts locally inside the bundle and link them locally.
- Ensure correct loading order (CSS before JS; JS loaded safely such as with `defer`), semantic/valid HTML structure, and remove any duplicate/conflicting libraries within the bundle.
- Add a short English `README` inside the offline bundle explaining how to open the site offline and showing the final folder structure.

**User-visible outcome:** Users can download the new offline bundle folder and open `index.html` directly (double-click) in a modern browser to use the site fully offline without console errors.
