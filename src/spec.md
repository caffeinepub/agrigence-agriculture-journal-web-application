# Specification

## Summary
**Goal:** Roll back the deployed application to version v59 so both frontend and backend match what was running in v59.

**Planned changes:**
- Restore the frontend code/bundle to the v59 version and redeploy.
- Restore the backend Motoko canister (WASM) to the v59 version and redeploy, including state alignment if needed.
- Validate that primary routes (/, /consultation, /products, /subscription, /admin) load without runtime errors.
- Verify the Consultation page renders and that WhatsApp and Mail actions behave as in v59 (no crashes; buttons enable/disable based on form validity).

**User-visible outcome:** The production app behaves the same as it did in v59, with key routes loading correctly and the Consultation page actions working as before.
