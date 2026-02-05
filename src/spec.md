# Specification

## Summary
**Goal:** Replace the existing on-page content of the Author Guidelines page (same URL: `/author-guidelines`) with the exact user-provided “Author Guidelines, Editorial & Publication Policy — Agrigence” policy text, keeping the site’s current look and improving SEO metadata.

**Planned changes:**
- Update the existing `/author-guidelines` page to render the provided text verbatim (no rewriting/paraphrasing), including an H1, introductory paragraphs with a 3-item bullet list, and two H2 sections.
- Implement semantic HTML structure for the content: proper heading hierarchy and real `<ul>/<ol>` lists, including ordered list items 1–12 under “Publication Policy” and 13–20 under “Formatting Guidelines”.
- Preserve the existing green agriculture theme, spacing, typography, and ensure the page remains mobile responsive (no horizontal scrolling/clipped text).
- Make the page SEO-friendly without changing the URL: set `document.title` to the exact H1 text and add a meta description derived from the provided introduction (without altering on-page text).

**User-visible outcome:** Visiting `/author-guidelines` shows the updated Author Guidelines, Editorial & Publication Policy content exactly as provided, with clean headings and proper bullet/numbered lists, consistent styling across devices, and updated page title/meta description for SEO.
