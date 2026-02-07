# Specification

## Summary
**Goal:** Let admins sign in from the standard login flow and be routed to the admin panel automatically, and replace footer social icons with the correct Agrigence profile links.

**Planned changes:**
- Update the post–Internet Identity login flow on `/login` to check admin status using the existing admin check and redirect admins to `/admin` and non-admin authenticated users to `/dashboard`.
- Add error handling so if the admin check fails (e.g., canister/network error), an English error message is shown and the user is not incorrectly routed to `/admin`.
- Replace footer placeholder social links with the provided Agrigence URLs and ensure they open in a new tab with safe link attributes (`target="_blank"`, `rel="noopener noreferrer"`).

**User-visible outcome:** After signing in with Internet Identity from `/login`, admins are taken directly to the admin panel and regular users go to the dashboard; the site footer social icons open the correct Agrigence social pages in a new tab.
