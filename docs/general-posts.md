# Home conversations and content discovery

This milestone expands Crumb Club’s Home beyond finished bakes. It adds ordinary posts, two main Home tabs and a lightweight composer while preserving the existing shell, landing page, recipe resources and browser activity store.

The later [profiles and following milestone](profiles-following.md) replaces the fixed current-baker follow list with persistent local relationships and extends public profiles.

## Home and Following

Home has two tabs: For you and Following. For you contains general posts, bakes, recipe activities and little finds. Both views use fixed fixture publication timestamps for chronological ordering. Demo interests remain available as browsing preferences; they no longer rank Home content.

Following uses a small mock relationship list, `followedAuthorIds`, currently containing Sophie and Amelia. It filters both posts and recipe activities by author. There is no follow/unfollow interface or backend. The selector supports an empty relationship list and the view has an appropriate empty state.

The existing collection destinations remain intact:

- `/app?feed=saved` displays all locally saved posts and recipes, including text-only posts and independent recipes outside the default feed.
- `/app?feed=recipes` retains the recipe activity collection.
- `/app?feed=finds` retains the discovery collection.

These views remain accessible through the existing collection navigation. They are not extra Home tabs. Saved remains available in the demo profile as well. This checkout’s existing Saved destination is a query-based collection view, not a separate `/saved` route.

## Content model

`Post` now discriminates three social entities; `Recipe` remains separate:

| Entity | Required content | Optional content |
| --- | --- | --- |
| General post | Author, timestamp and text | Multiple images. No title, category or recipe is required. |
| Bake post | Author, timestamp and a non-empty image gallery | Caption, baked-good category and `recipeId`. |
| Little find | Author, timestamp and caption | Images, category, location and simple relevant tags. |
| Recipe | Author, timestamp, title, description, cover, ingredient quantities and instructions | Category, additional images, times, yield and notes. |

Books, questions, memories and inspirations do not have their own post types. They fit naturally within a general post or little find.

Every resource has an explicit `publishedAt` timestamp for ordering and a relative display label for the fixed mock timeline. Neither dates nor ranking are recalculated from the client clock during rendering.

The existing reaction IDs and `crumb-club:activity:v1` schema are unchanged. General posts reuse the same likes, saves, comments and detail routing. Text-only cards omit the gallery and unnecessary article headings. Saved lists display an initials tile when a post has no photograph.

## Composer and draft entry points

For you begins with “What’s on your mind?” and four actions:

| Action | Destination | Editor mode |
| --- | --- | --- |
| Composer prompt | `/create?type=post` | General post |
| Photo | `/create?type=post&photo=1` | General post with image selection available |
| Bake | `/create?type=bake` | Bake |
| Recipe | `/create?type=recipe` | Standalone recipe draft |
| Find | `/create?type=find` | Little find |

All entries use the existing Create editor. An explicit mode is respected even if a different type of draft is stored. Visiting Create without a mode still restores the existing draft. Drafts continue to use `crumb-club:draft:v1` and are saved only when the user selects Save demo draft.

General post drafts have no title field and can be saved with text or a photograph. Recipe drafts still require their title, ingredients and method. Bake and find draft titles are optional. A general post preview does not invent an article title.

This is not a publishing implementation. The editor identifies itself as a demo draft, does not insert records into the live feed, and confirms local saving rather than claiming public publication. Its existing single-photo editor remains; multi-image publishing, recipe linking during creation and server persistence are future work. Multi-image fixture posts are fully supported in the reading experience.

## Category discovery

`src/data/categories.ts` defines the shared baked-good category names and their TypeScript union. Bake posts and recipes can carry a category; little finds can carry relevant categories and tags. General posts have no mandatory classification and are never forced into Other.

Explore retains its existing search, category shortcuts and image-led layout. Its results now come from the canonical content rather than just the original three marketing previews. Exact category matches find both social bakes and standalone recipes. The Cookies category demonstrates this with Amelia’s cookie bake and the independent chocolate chip cookie recipe. The Bakery shortcut uses a simple Bakery tag on relevant little finds.

Uncategorised general posts remain visible in Home and can appear in unfiltered Explore search results. Text-only discovery results show the post excerpt instead of a broken or invented image. The default Explore composition remains a small curated preview.

## Mock examples

The canonical fixture collection now contains six social posts and three recipes. Eight resources appear as default Home activities; the cinnamon-bun recipe remains independently accessible through its bake link and Saved.

- Sophie’s rainy-day thought is a text-only general post with no category.
- Noor’s kitchen memory is a general post with two photographs and no category.
- Sophie’s cinnamon buns remain a multi-image bake with a linked recipe.
- Amelia’s cupcake recipe remains an independent recipe activity.
- James’s bakery discovery remains a little find.
- Noor’s first loaf remains a bake without a recipe link.
- Amelia’s cookie bake and cookie recipe demonstrate shared category discovery.

Existing photo proportions are retained. Galleries display complete images, use the first photograph’s proportions for a stable frame, and retain touch, keyboard and reduced-motion controls.

## Source changes

- `src/features/community/types.ts`: general posts, optional find imagery, explicit publication timestamps and categories.
- `src/data/content.ts`: expanded fixtures and mock followed-author IDs.
- `src/data/categories.ts`: shared category values.
- `src/features/community/feed-selection.ts`: simple chronological and followed-author selection.
- `src/features/community/classification.ts`: category and resource-kind matching.
- `src/features/community/home-composer.tsx`: shared Create entry links.
- `home-feed.tsx`, `feed-post.tsx` and `post-detail.tsx`: mixed content, compact ordinary posts and existing collection views.
- Existing preview adapters, discovery and profile components: optional-image handling and canonical discovery results, without layout redesigns.
- Existing Create editor: a general draft mode and correct entry-mode selection.

The application shell, public landing page and activity provider are unchanged.

## Verification

`npm test` covers nine model and selection cases: identity/reference validity, independent recipes, gallery fixtures, optional recipe links, general posts without media/categories, chronological mixing, followed-author filtering including an empty list, and category discovery across bakes and recipes.

TypeScript and production builds are checked. Browser verification covers both Home tabs, ordinary post interactions and persistence, existing Saved handling, cookie category results, independent recipe checklists, composer mode selection, local general draft restoration, image galleries and existing compatibility routes. Responsive review includes 320, 390, 768, 1024 and 1440 pixels.

There is no configured lint command. A full accessibility audit and maintained browser regression suite remain future work.
