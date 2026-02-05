# Specification

## Summary
**Goal:** Add a persisted Editor-in-Chief entry for Dr. Dinesh Kumar Singh so it appears on the Editorial Board page and in the Admin Panel editorial member list.

**Planned changes:**
- Add a new editorial member record with: name "Dr. Dinesh Kumar Singh", role/badge "Editor-in-Chief", and qualification/affiliation text "Asst. Professor, National P.G. College, Barahalganj, Gorakhpur,".
- Ensure the new record is persisted across canister upgrades/redeploys and is returned by the existing editorial member listing API used by the Editorial Board UI (e.g., `getAllEditorialMembers`), including `isEditorInChief = true`.
- Ensure any newly introduced/updated user-facing text uses correct English spelling and capitalization (specifically "Editor-in-Chief").

**User-visible outcome:** The Editorial Board page and Admin Panel editorial member list show Dr. Dinesh Kumar Singh with an "Editor-in-Chief" badge, and the entry remains present after redeploy/upgrade.
