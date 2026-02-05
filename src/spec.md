# Specification

## Summary
**Goal:** Replace the current GIF-based fullscreen LoadingScreen with a lightweight Agrigence-themed flat-vector book→sprout→plant preloader and add a smooth fade-out into the app.

**Planned changes:**
- Update `frontend/src/components/LoadingScreen.tsx` to remove the existing GIF reference and render a custom SVG (or Lottie) animation: closed book appears, opens, soil appears in the crease, sprout emerges, and grows into a plant with 3–4 leaves, centered on a clean white background with a subtle soft shadow and green agriculture palette.
- Implement a smooth dismissal flow where, when the animation completes (or the app is ready), the loader fades out (opacity transition), blocks interaction until fully gone, then unmounts without layout shift or flicker.
- Keep the preloader implementation performance-friendly by avoiding large raster assets and minimizing main-thread work and React re-renders during the animation.

**User-visible outcome:** On initial load, users see a centered Agrigence book-to-plant animation on a white background that smoothly fades out into the website content once ready.
