# Crumb Club

A Next.js App Router frontend prototype with TypeScript, Tailwind CSS, Lucide icons, and local mock data.

See [Implementation status](docs/implementation.md) for the screens, interactions, architecture, verification and remaining milestones.

## Run

```sh
npm install
npm run dev
```

Open http://localhost:3000.

```sh
npm test
npm run typecheck
npm run build
npm start
```

Webpack is selected because Turbopack's CSS worker cannot bind its internal port in the restricted development environment.

## Current milestone

The [shared recipe book experiment](docs/recipe-book.md) gives `/recipes` a contents view and cookbook-style recipe pages. It lives on `design/community-recipe-book`.

The latest [profiles and following milestone](docs/profiles-following.md) extends the existing profile layout with public baker pages, locally persisted follows, consistent counts and profile editing. Following and Popular bakers use the same relationship state.

The latest [Home conversations milestone](docs/general-posts.md) adds general text/photo posts, For you and mock Following, a compact composer and category discovery across bakes and independent recipes. Home uses chronological ordering; Saved remains at its existing collection destination.

The [social feed milestone](docs/social-feed.md) separates social posts presented with captions from standalone recipes. Home includes swipeable galleries, optional recipe links and recipe activities; recipes have their own `/recipes/[id]` pages. The old cupcake URL redirects without losing local activity.

The public landing page remains a separate marketing experience. Join links open `/join`, an optional demo flow for a name, baking vibe and interests.

The community application has a three-column desktop Home, a compact tablet navigation rail, and a dedicated mobile header and bottom navigation. `/app` includes feed filters, chronological ordering and contextual discovery. `/explore` provides search, category shortcuts and an image grid. Social post pages retain likes, saves and comments; recipes now have independent detail pages.

`/create` is a local draft editor with relevant fields and photograph preview. It saves one draft in this browser and does not publish posts. `/profile` retains interests and private saved content, with editing and counts added. `/profile/[handle]` shows baker-owned content and follow actions; collections remain future work.

Likes, saves and comments persist under `crumb-club:activity:v1`. Preferences use `crumb-club:demo:v1`; drafts use `crumb-club:draft:v1`. No authentication, backend, database or external API is implemented.

## Structure

- `src/app`: routes, brand styles in `globals.css`, application styles in `application.css`
- `src/components`: shared branding, responsive shell and preview components
- `src/data`: canonical posts/recipes/feed activities and legacy preview summaries
- `src/features/community`: existing activity state, feed, details and contextual discovery
- `src/features/demo`: preferences, onboarding and local profile
- `src/features/explore`: visual discovery and filtering
- `src/features/create`: local draft editor and image preview
- `public/images` and `public/fonts`: local assets

## Image sources

Unsplash photo IDs: `1509440159596-0249088772ff` (bread), `1509365465985-25d11c17e812` (cinnamon buns), `1517433670267-08bbd4be890f` (bakery), `1555507036-ab1f4038808a` (croissants), `1519869325930-281384150729` (cupcakes).

## Verification

Production build and strict TypeScript checks pass. Browser checks cover Home, Explore, Create, Profile, onboarding and post details at 320, 390, 768, 1024 and 1440 pixels, with screenshots reviewed and no horizontal overflow observed. The demo entry, interest ordering, original likes/saves/comments/recipes, search/category filters, photo preview, draft restoration, blocked-storage fallback and safe mobile action placement passed. No runtime page errors were observed.

Twelve content-model/selection/relationship tests are committed and run with `npm test` on Node 24. Browser tooling lives in a temporary directory; no browser-test dependency or maintained browser regression suite has been added to the project. See the implementation document for remaining scope and verification limits.
