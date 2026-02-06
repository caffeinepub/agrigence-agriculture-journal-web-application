# Specification

## Summary
**Goal:** Add a standalone, offline-ready journal portal mini-app under `/project` (pure HTML/CSS/JS) with authentication, user dashboard, and admin panel that works via direct `file://` access.

**Planned changes:**
- Create `/project` folder structure with `index.html`, `dashboard.html`, `admin.html`, plus `/css`, `/js`, `/assets`, `/receipts`, and an in-app `/project/README.md`.
- Implement `index.html` auth flows (Login, Register, Forgot Password) using an offline dummy JSON “database” stored in a JS file with persistence via web storage and session simulation; redirect authenticated users to `dashboard.html`.
- Implement access guards so unauthenticated users are routed back to `index.html`, and admin-only access is enforced for `admin.html`.
- Build `dashboard.html` with: Payment Status (with mock receipt download), Receipt details view, Submissions table (with statuses and local file download links), Admin Remarks per submission, and a “Revision Required” re-upload control that updates the dummy data.
- Add “My Profile” section to `dashboard.html` with editable fields (email read-only) and profile photo upload simulation; persist changes to the dummy DB and make them visible in the admin panel.
- Add password management: Change Password in dashboard, Forgot Password matching on index (email/phone/DOB/occupation), and admin-driven password reset in `admin.html`.
- Implement `admin.html` user management: view users and profiles, update payment status/details, edit submission remarks, change submission statuses, reset user passwords, and optionally attach a receipt reference pointing to a local file under `/project/receipts`.
- Provide a shared CSS style system (single main CSS file) and a main JS entry file (with optional small helper modules) to ensure consistent, professional journal-portal UI components and responsive layouts.

**User-visible outcome:** Users can open `/project/index.html` offline to register/login, recover passwords, view and manage their profile, see payment/receipt info, download mock receipts, track submissions and remarks (including re-upload when revisions are required), and change their password; admins can open the offline admin panel to manage users, payments, submissions, remarks, receipt references, and reset user passwords.
