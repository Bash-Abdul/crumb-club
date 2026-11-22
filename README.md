# Crumb Club

A responsive Next.js frontend prototype for the baking ecosystem: home bakers, bakery lovers and anyone curious about baked goods.

The latest milestone adds [weekly bakes](docs/weekly-bakes.md): open themes and featured recipes with linked kitchen contributions. It builds on the community Home grid, content filters and personal mascot walkthrough. See [Community grid and tour](docs/community-grid-and-tour.md) for implementation details and [Implementation status](docs/implementation.md) for historical scope.

Home offers All, Bakes, Recipes, Little finds and Conversations. Following has been removed; profiles highlight contributions and recipes tried, while Meet the club introduces members without rankings. The shared recipe book, recipe attempts, reactions, comments and saved favourites remain available.

The chosen mascot guides first-time visitors through seven controls. Completion or skipping is remembered locally; the tour can be replayed from Profile.

This is a frontend prototype with mock content and local browser storage. Create saves drafts; there is no authentication, publishing backend or shared database.

## Structure

- `src/app`: routes, brand styles in `globals.css`, application styles in `application.css`
- `src/components`: shared branding, responsive shell and preview components
- `src/data`: canonical posts/recipes/feed activities and legacy preview summaries
- `src/features/community`: existing activity state, feed, details and contextual discovery
- `src/features/demo`: preferences, onboarding and local profile
- `src/features/explore`: visual discovery and filtering
- `src/features/create`: local draft editor and image preview
- `src/features/mascots`: character artwork components and local mascot preferences
- `public/images` and `public/fonts`: local assets

## Image sources

Unsplash photo IDs: `1509440159596-0249088772ff` (bread), `1509365465985-25d11c17e812` (cinnamon buns), `1517433670267-08bbd4be890f` (bakery), `1555507036-ab1f4038808a` (croissants), `1519869325930-281384150729` (cupcakes).

## Verification

Production build and strict TypeScript checks pass. Browser checks cover Home, Explore, Create, Profile, onboarding and post details at 320, 390, 768, 1024 and 1440 pixels, with screenshots reviewed and no horizontal overflow observed. The demo entry, interest ordering, original likes/saves/comments/recipes, search/category filters, photo preview, draft restoration, blocked-storage fallback and safe mobile action placement passed. No runtime page errors were observed.

Twenty content-model, feed-selection, recipe-attempt, weekly-bake and tour tests are committed and run with `npm test` on Node 24. Browser tooling lives in a temporary directory; no browser-test dependency or maintained browser regression suite has been added to the project. See the implementation document for remaining scope and verification limits.
