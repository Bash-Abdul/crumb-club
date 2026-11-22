# Community grid and mascot tour

Implemented on `design/community-grid-and-mascot-tour`, 22 November 2026.

## Community Home

Home now uses All, Bakes, Recipes, Little finds and Conversations. All presents an editorial arrangement of real content types; individual filters show newest contributions first. Every contribution appears once. Recipes remain independent entries in the shared book at `/recipes` and can also appear in Home.

Desktop uses varied card widths, a navigation sidebar and a right rail. The rail retains This week’s bake and three recipe-book suggestions, followed by Meet the club. Member introductions cycle without popularity rankings or follow controls. Smaller screens simplify the grid to one column. Photographs retain their proportions; galleries contain mixed orientations without cropping.

Existing reactions, comments, saves, recipe attempts and detail routes are reused. A gallery resize fix prevents the initial ResizeObserver notification from interrupting an early photo navigation.

## Profiles without following

Follow controls, follower/following counts, relationship fixtures and the Following feed have been removed. Profiles instead show recipes shared, bakes shared and recipes tried, derived from available content and attempts. Previous relationship storage is ignored and left untouched for compatibility with the older branch. Legacy or unknown Home filter values resolve to All.

## Mascot walkthrough

A first visit to Home starts a seven-step tour using the visitor’s selected Croissant, Cookie, Baker or Crumb companion. The steps highlight Home, content filters, the recipe book, Saved, the composer, search and Profile. Next, Back, Skip, close and Done controls are available. Profile offers a replay button.

The tour follows visible targets across responsive layouts, scrolls them into view and repositions on resize. The application behind the dialog is inert; keyboard focus stays inside it, Escape skips, and focus returns on dismissal. Reduced-motion preferences are respected.

`crumb-club:tour:v1` remembers `complete` or `skipped`. If storage is blocked, dismissal still lasts for the current visit. Server rendering and initial hydration use a stable snapshot before reading browser preferences.

## Scope and verification

This remains a local frontend prototype. Create saves drafts rather than publishing; notifications have no backend. Existing activity, mascot and recipe-attempt storage keys are preserved.

Seventeen automated tests cover content identities, content filters, deduplication, legacy filters, recipe attempts and tour state/navigation. TypeScript and production compilation are checked. Temporary browser checks cover responsive grids from 320 to 1920 pixels, filters, saves/reactions, gallery navigation across resize, contribution counts, member cycling and the seven-step tour on desktop and phones. Tour checks include focus trapping, dismissal persistence, replay and reduced motion. Browser tooling is not a committed regression suite.

## Profile visual update

Profiles now use a wide kitchen photograph, an overlapping avatar and a combined contribution/companion strip. Interests link to discovery. Posts, Recipes and Tried switch between the baker’s own content; Saved is available only on the local owner’s profile. The owner’s right rail previews saved content and recent recipe attempts. Empty states reflect actual local data rather than invented activity.

Profile editing and mascot selection retain their existing persistence. The profile options button provides the tour replay. The desktop layout becomes a single column on phones, with horizontally scrollable content navigation. Browser checks cover 320, 390, 768 and 1440 pixels, content navigation, profile editing, mascot selection and public-profile privacy.
