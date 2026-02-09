# Specification

## Summary
**Goal:** Fix the Consultation page flow so it renders reliably and the WhatsApp/Mail contact actions work without runtime or TypeScript build errors.

**Planned changes:**
- Identify and fix the current error preventing the `/consultation` route from rendering and ensure the page has no TypeScript issues (including unused imports/variables).
- Ensure form validity used to enable/disable contact buttons is a strict boolean, and enable “WhatsApp Us”/“Mail Us” only when all required fields are valid.
- Fix WhatsApp link generation to build a valid `wa.me` URL and open in a new tab; show an English error toast if the popup is blocked.
- Fix email link generation to navigate to a valid `mailto:` URL with URL-encoded subject/body containing consultation type, name, email, and message.
- Add minimal automated regression coverage for URL generation (WhatsApp + mailto encoding) and form-validity gating for the contact buttons.

**User-visible outcome:** Visiting `/consultation` shows the consultation form without crashes; when the form is valid, users can click “WhatsApp Us” or “Mail Us” to open correctly generated links, with clear English feedback if a popup is blocked.
