# Social feed and independent recipes

This milestone changes Home’s content model and reading experience while retaining the existing application shell, landing page, discovery layout and local interaction store.

The later [Home conversations milestone](general-posts.md) extends this foundation with general posts, chronological For you/Following views and category discovery. Its documentation supersedes the original fixture counts and interest-ordering behaviour below.

## Content entities

`src/features/community/types.ts` defines separate entities:

- `Post` is a union of `BakePost` and `DiscoveryPost`. Both have an author, timestamp, a non-empty image gallery, base reactions and comments. Bakes have an optional caption and optional `recipeId`; discoveries have a caption and optional location. Social posts have no title, ingredients or method fields.
- `Recipe` owns its title, description, author, cover, optional additional images, ingredient quantities and ordered instructions. Preparation time, baking time, yield and notes are optional. It does not depend on a post.
- `FeedItem` discriminates `{ kind: 'post', postId }` from `{ kind: 'recipe', recipeId }`. Home resolves these references against the separate fixture collections.

`src/data/content.ts` contains the canonical mock entities and feed order. Multiple bake posts can reference the same recipe. Neither a recipe nor its instructions are copied into the referring post.

The existing `src/data/posts.ts` retains its three legacy preview summaries for the unchanged landing page and discovery views. It also derives compatibility previews for saved lists from the canonical content. These summaries are presentation records, not the social `Post` entity.

## Mock content

| Resource | Representation |
| --- | --- |
| Sophie’s cinnamon buns | Bake post with three photographs, an expandable casual caption and a link to the independent cinnamon-bun recipe. |
| Mum’s vanilla cupcakes | Independent recipe, shown as a recipe activity in Home. There is no backing social post. |
| James’s bakery discovery | Discovery post with two photographs, caption and location; no recipe. |
| Noor’s first loaf | Single-image bake post with a caption and no linked recipe. |
| Slow Sunday cinnamon buns | Independent recipe linked by Sophie’s post. It can be opened directly and saved without being an activity in the default feed. |

Photography is illustrative sample content. Additional gallery photographs are from [star of the sea on Unsplash](https://unsplash.com/photos/a-close-up-of-a-plate-of-cinnamon-rolls-3LEpJUuT298) and [Christelle Sison on Unsplash](https://unsplash.com/photos/a-pan-filled-with-cinnamon-rolls-on-top-of-a-table-Jp_P50sl6uM), downloaded to `public/images/buns-proofing.jpg` and `public/images/buns-table.jpg`.

## Home presentation

Ordinary posts use compact author/activity headers, photographs, social actions and captions. They do not display article-style titles. Longer captions can be expanded and collapsed. Post timestamps and conversation links retain access to the detail page. Optional recipe previews open the independently accessible recipe.

Recipe activities retain a title, a short description, optional metadata and an explicit full-recipe link. Ingredients and instructions stay on the recipe page.

For you, Recipes, Little finds and Saved filters remain. Interest-based ordering still applies to the unfiltered feed. Saved includes independent recipes even when they do not appear in the default activity list. Existing discovery and profile layouts are preserved; their saved links can resolve either resource type.

## Gallery behaviour

`ImageGallery` uses native horizontal scrolling and CSS scroll snap, without a carousel package. It supports:

- Touch swiping with normal vertical page scrolling.
- Previous and next controls at desktop widths.
- Keyboard Left/Right, Home and End while the gallery is focused.
- Photo counts, selectable position dots and screen-reader status.
- Individual image alternative text and hidden inactive slides in the accessibility tree.
- Reduced-motion preferences for programmatic navigation.
- Single images without unnecessary controls.

The component is reused on post and recipe pages. Each gallery takes its proportions from its first photograph, using stored width/height metadata when available and natural image dimensions after load as a fallback. Portrait, square and landscape posts therefore have different heights. Every slide uses containment so the full photograph remains visible; mixed orientations share a steady first-photo frame, with warm background space where necessary. Recipe activity covers also retain their natural proportions. No tap is needed to see the complete photograph.

## Routes and compatibility

| Route | Behaviour |
| --- | --- |
| `/posts/sunday-buns` | Sophie’s social bake and gallery. |
| `/posts/little-bakery` | James’s discovery and gallery. |
| `/posts/first-loaf` | Noor’s recipe-free, single-image post. |
| `/recipes/lemon-cake` | Independent vanilla cupcake recipe. |
| `/recipes/cinnamon-buns` | Independent cinnamon-bun recipe. |
| `/posts/lemon-cake` | Compatibility redirect to `/recipes/lemon-cake`; existing links remain usable. |

The historical cupcake ID `lemon-cake` is retained deliberately. Its existing likes, saves and comments continue to use the same local activity key. It is not represented as a social post in the new model.

## Reused interactions

The activity provider and storage key `crumb-club:activity:v1` are unchanged. `PostActions` accepts a small resource target containing the ID, accessible label, canonical route, base likes and fixture comments. It therefore works for either entity without duplicating state logic.

The previous comment form is extracted into `Comments`, and the ingredient checklist and method are extracted into `RecipeBody`. Recipe and post pages share these components where relevant. Checklist state remains temporary to the current visit; likes, saves and comments remain browser-persistent.

IDs are unique across these fixtures because the existing activity store is keyed by resource ID. Future server-generated identifiers or an entity-prefixed key scheme must preserve or migrate existing local keys.

## Verification

`npm test` runs four dependency-free Node tests covering separate identities, valid feed and recipe references, independent cupcake content, gallery fixtures, optional recipe links and a shared recipe relationship. The test command uses Node’s TypeScript stripping and was verified with Node 24.

TypeScript and production builds are checked. Browser verification covers desktop controls, keyboard navigation, native touch swiping, reduced-motion controls, caption expansion, correct recipe routing, ingredient checklists, comment persistence, legacy activity restoration, saved standalone recipes, missing resources and existing routes. Home, post details and recipe details are reviewed at 320, 390, 768, 1024 and 1440 pixels.

No lint script or lint configuration is present, so there is no configured lint command to run. Browser tooling remains outside the repository; a maintained browser regression suite and comprehensive accessibility audit are still future work.

## Decisions before Create integration

Create is intentionally unchanged in this milestone. Its existing local draft editor is not connected to the new entities or feed. Before implementing publication:

1. Make bake titles optional and add multi-image draft selection, ordering and removal.
2. Let bakers select an existing recipe or create a standalone recipe, rather than embedding instructions in a post.
3. Define the save/publish outcome for a recipe resource and its optional feed activity.
4. Decide whether ingredient quantities remain display strings or become structured quantities and units.
5. Define persistent identifiers and the local-to-server activity migration strategy.

The prototype still has no real authentication, backend, uploads service, moderation or live multi-user state. Gallery photos and recipes are fixtures, not user submissions.
