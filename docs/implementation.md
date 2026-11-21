# Crumb Club implementation status

Updated 20 November 2026.

Crumb Club is a responsive frontend prototype for a baking and baked-goods community. It includes the public landing page, a redesigned community application, optional demo onboarding, visual discovery, individual stories and recipes, and a local draft editor.

Desktop and mobile share routes, mock data and interaction logic. Desktop uses a persistent navigation sidebar, a reading-width feed and contextual discovery. Mobile uses a compact branded header, bottom navigation and content-first screens.

The [social feed milestone](social-feed.md) separates social posts from standalone recipes and documents the gallery, routes, compatibility and remaining Create decisions.

The latest [Home conversations milestone](general-posts.md) adds general posts, mock Following, composer shortcuts and shared category discovery. Home is chronological; interests no longer rank its content.

The latest [profiles and following milestone](profiles-following.md) extends the existing profile with public baker routes, locally persisted follow relationships and inline profile editing. Following now updates from those relationships.

All community members, stories and bakery details are illustrative. There are no real accounts or backend services.

## Routes and scope

| Route | Status | Available behaviour |
| --- | --- | --- |
| `/` | Implemented | Public editorial landing page, community preview and invitations to explore or join. The redesign preserves its composition and styles; only Join destinations changed to `/join`. |
| `/join` | Implemented demo flow | Optional name, baker/lover/both selection, interests and entry to the community. Public browsing is available without setup. |
| `/app` | Implemented | Community feed, recipe/discovery/saved filters, personalised ordering, contextual baking prompt and discovery links. |
| `/explore` | Implemented prototype discovery | Search, category shortcuts, a compact image grid, bakery discovery and empty states. Results include categorised posts and recipes, plus uncategorised posts through unfiltered search. |
| `/posts/sunday-buns` | Implemented | Sophie’s first cinnamon buns, full story, reactions and comments. |
| `/posts/little-bakery` | Implemented | James’s illustrative bakery discovery, location label, story, reactions and comments. |
| `/posts/first-loaf` | Implemented | Noor’s single-image bake without a linked recipe. |
| `/recipes/lemon-cake` | Implemented | Independent vanilla cupcake recipe with an ingredient checklist and comments. |
| `/recipes/cinnamon-buns` | Implemented | Independent cinnamon-bun recipe linked from Sophie’s bake. |
| `/posts/lemon-cake` | Compatibility route | Redirects to the independent cupcake recipe and retains the existing activity identity. |
| `/create` | Local draft prototype | Bake/find/recipe modes, relevant fields, photograph upload and preview, draft preview, and local saving/restoration. Drafts are not published to the feed. |
| `/profile` | Extended demo profile | Display name, handle, optional bio/avatar, follow counts, inline editing, published-content section and private saved content. |
| `/profile/[handle]` | Public baker profiles | Shared profile layout, actual author-owned posts/recipes, counts and Follow/Unfollow; private Saved is excluded. |

Unknown post identifiers show a missing-story page with a route back to Home.

## Visual foundation

The reference boards inform the bakery and food-editorial identity: cream `#FFF8F1`, butter `#FFE7B3`, caramel `#D98A46`, cocoa `#7A3E2E` and espresso `#381F14`. Fraunces supplies editorial headings; Inter supplies body text and controls. Fonts and photographs are served locally, with Lucide icons for navigation and actions.

Marketing styles are kept in `globals.css`; application and onboarding styles live in `application.css`. The landing page remains an editorial brand experience with its asymmetric hero, introduction, varied Bake/Discover/Share sections, community preview and closing invitation.

## Responsive application layout

At wide desktop widths, Home has three deliberate columns:

- A persistent left sidebar with primary routes, Saved/Recipes/Little finds shortcuts, and a demo entry or profile shortcut.
- A central feed with a compact contextual heading, filters and cards. Feed width stays around 600–680 pixels where space permits.
- A discovery column with the weekly baking prompt, three recipe links and Popular bakers. Everyone in the community is referred to as a baker, including people who mainly discover and enjoy baked goods.

Below 1200 pixels, the right discovery column is hidden and a compact baking prompt is integrated after the first post in the unfiltered feed. At 768–900 pixels, the navigation becomes a compact icon rail with accessible labels.

Below 768 pixels, the sidebar is replaced by a sticky branded header and fixed bottom navigation. The large welcome introduction is removed. Feed cards use compact author information, photo proportions based on the first image, concise captions and familiar reactions. Photographs remain fully visible; mixed gallery orientations fit inside a steady frame without cropping. Desktop sidebar sections are not appended below the mobile feed. Safe-area spacing and bottom content padding keep final actions reachable above navigation.

Home is a story feed. Explore is a separate browsing composition with search, a category grid, image-led tiles and a bakery discovery section.

## Home and discovery behaviour

The right sidebar keeps This week’s bake and shows three independent recipes under From the recipe book. Popular bakers replaces the old bakery and saved-list sections. These are curated demo suggestions, without calculated popularity or follower counts; each baker now links to a public profile and shares a persistent Follow/Following action with that profile. The existing `?baker=<id>` Explore filter remains available. Saved remains accessible from the existing collection navigation and profile.

Home’s For you view mixes general posts, bakes, discoveries and recipe activities in chronological order. Following filters this same timeline to the current baker’s locally persisted relationships, initially seeded from the previous mock list. The compact Home composer opens the existing local draft editor in the appropriate post, photo, bake, recipe or find mode.

Saved, Recipes and Little finds remain accessible through their existing collection URLs and sidebar links. They are separate collection views rather than extra Home tabs. Saved includes posts without images and independent recipes outside the default feed. Interests remain browsing preferences and do not rank this timeline.

Explore supports categories for cakes, cookies, pastries, bread and cupcakes, with additional categories under More. Search matches titles, captions, category labels, authors and interest tags. Category and search filters can be combined. Categories without fixture content show an explanatory empty state rather than invented results.

The category matcher uses optional canonical categories and relevant find tags; general posts have no required category. Explore accepts category links such as `/explore?category=recipes`, `/explore?category=bakeries` and `/explore?category=Cupcakes`.

The baking prompt is an invitation, not a timed challenge or rewards feature. Its action opens the local draft creator.

## Stories, recipes and participation

Social post pages show the full caption, author information, gallery, reactions, comments and back navigation. Optional recipe links open independent recipe pages; comment actions link to the conversation section.

Amelia’s recipe includes preparation and baking times, yield, ingredient quantities, an ordered method and an allergen note. Ingredients can be checked off during a recipe visit. Checklist state resets when the component is remounted, including on refresh.

| Interaction | Behaviour |
| --- | --- |
| Like | Toggles the visitor’s reaction and adds or removes one from the fixture’s base count. |
| Save | Updates saved state across the feed, discovery tiles, landing previews, post pages, sidebar and demo profile. |
| Comment | Appends non-empty text up to 1,000 characters, attributed to “You”, and updates the conversation count. |
| Demo preferences | Saves an optional name, baking vibe and interests; updates the greeting, local profile and Home ordering. |
| Draft creation | Saves one editable draft locally, including an optional photograph. It does not create a published community post. |

## Demo entry and local storage

Join opens a clearly labelled frontend demo with no password or sign-in. Visitors can browse public content without completing it. Existing preferences can be edited through `/join`.

The existing activity provider continues to own likes, saves and comments; the redesign does not replace that logic. Separate demo preference and draft storage keep their responsibilities distinct.

| Storage key | Contents |
| --- | --- |
| `crumb-club:activity:v1` | Per-post likes, saves and submitted comments. |
| `crumb-club:demo:v1` | Optional name, baker/lover/both role and interests. |
| `crumb-club:draft:v1` | One saved demo draft, including its optional image. |
| `crumb-club:following:v1` | Current baker’s followed IDs. |
| `crumb-club:profile:v1` | Current baker’s edited display name, bio and optional avatar. |

Stored values are checked before being restored. The activity and preference providers fall back to in-memory behaviour when browser storage is unavailable. Relevant screens display a storage notice. Draft saving reports a failure instead of claiming the draft was saved when storage is blocked or full.

Data is specific to the browser and origin. There is no cross-device synchronisation or real-time synchronisation between tabs. Comments cannot yet be edited or deleted. Clearing the corresponding storage keys resets local activity, preferences or drafts without changing fixtures.

## Draft editor details

The shared editor offers four modes: a general post, bake, little find and recipe. General posts have no title field and support text or an optional photograph. Other draft titles are optional except for recipes. Finds reveal a bakery/location field; recipes reveal required ingredients and method fields.

Photographs accept JPG, PNG or WebP up to 2 MB. They are read and previewed locally; there is no upload service. A preview can be removed or replaced. Saving a general draft requires text or a photograph. Recipe drafts require a title, ingredients and method. A confirmation states that the draft stays on this device and is not published. Returning to Create restores the saved draft.

## Accessibility and interface states

Implemented provisions include semantic landmarks, labelled navigation and forms, image alternative text, visible keyboard focus, a skip link, current-route states and pressed states for toggles. Compact tablet navigation keeps accessible names when text labels are hidden. Onboarding uses native radio buttons and checkboxes and moves focus to the heading when advancing steps.

Reduced-motion preferences disable smooth scrolling and transitions. Loading, saved-feed empty, discovery empty, feed error/retry and missing-story states are provided. Comments announce success; photo validation and draft-save failures show inline feedback.

A comprehensive assistive-technology audit and formal accessibility compliance review remain outstanding.

## Technical structure

The prototype uses Next.js App Router, React, strict TypeScript, Tailwind CSS, custom CSS and Lucide icons. Webpack is selected because Turbopack’s worker encountered execution-environment restrictions.

| Location | Responsibility |
| --- | --- |
| `src/app/page.tsx` | Public landing page. |
| `src/app/layout.tsx` | Root metadata, styles and activity/demo providers. |
| `src/app/globals.css` | Brand tokens and marketing styles. |
| `src/app/application.css` | Application, discovery, onboarding, creation and profile layouts. |
| `src/app/app/` | Home, loading state and error boundary. |
| `src/app/posts/[id]/` | Post routes, metadata and missing-post fallback. |
| `src/app/explore/`, `join/`, `create/`, `profile/` | Dedicated feature routes. |
| `src/components/app-shell.tsx` | Responsive sidebar, compact header and bottom navigation. |
| `src/features/community/` | Feed, story/recipe details, discovery sidebar, existing activity state and detailed fixtures. |
| `src/features/demo/` | Preferences, onboarding, interest mappings and local profile. |
| `src/features/explore/` | Visual browsing, categories and search. |
| `src/features/create/` | Local draft editor and image preview. |
| `src/data/content.ts` | Separate social posts, recipes, feed activities and lookup helpers. |
| `src/data/posts.ts` | Legacy preview summaries and adapters for existing saved lists. |
| `public/fonts/`, `public/images/` | Local typography and food photography. |

No backend, authentication provider, database, payment service or API integration is introduced.

## Verification

Production build and strict TypeScript checks pass. Responsive browser checks and screenshot review covered 320, 390, 768, 1024 and 1440 pixels, including Home, Explore, Create, Profile, onboarding and post details. Passing interaction checks covered Join entry, preference restoration and ordering, feed filters, reactions, comments, recipes, discovery filters, image preview, draft restoration and safe bottom action placement. Blocked-storage fallback and removing the last saved post also passed. No runtime page errors or horizontal overflow were observed in the tested flows.

Twelve model/selection/relationship tests are committed under `tests/content.test.mjs` and related `tests/*.test.mjs` files and run with `npm test`. Browser tooling runs from a temporary directory rather than a committed browser-test suite. Formal cross-browser coverage, full accessibility auditing and a maintained automated regression suite remain future work.

## Run locally

```sh
npm install
npm run dev
```

Open the URL printed by Next.js, normally `http://localhost:3000`. Use `/app` for the community, `/join` for demo entry, and `/explore` for public discovery.

```sh
npm run typecheck
npm run build
npm start
```

## Remaining work

Future milestones include publishing mock creations into the community feed, richer discovery data, server-backed publication, named collections and a baking journal. The canonical fixture set has six social posts and three independent recipes. Explore uses the canonical catalogue; categories without sample content deliberately show an empty state.

Real authentication, backend persistence, payments, messaging, live bakery search, real geolocation and native mobile features remain outside this frontend prototype’s scope.
