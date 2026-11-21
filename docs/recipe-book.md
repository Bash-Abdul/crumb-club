# Recipe book experiment

Branch: `design/community-recipe-book`.

The Recipes collection now opens `/recipes`, a single community recipe book. The existing `/app?feed=recipes` address still renders the book. No recipe IDs or saved activity keys change.

## Design and interactions

- A cover spread, featured recipe, contributor links and stable recipe page numbers.
- Contents with category chapters, ingredient/title/baker search and a Bookmarked view.
- Bookmarks share the existing local activity state with Home, Explore and profiles.
- Recipe pages use paper margins, contributor credits, prep/bake/yield details, ingredients alongside method, kitchen notes and page-to-page links.
- Ingredient checklists, photographs, reactions and comments remain available.
- Desktop Recipes links and the mobile bottom navigation open the book. Home’s “From the recipe book” heading links to its contents.
- Add a recipe opens the existing `/create?type=recipe` editor. This remains a local draft flow; it does not publish a contribution into the book.

The book uses the existing three recipes from two bakers. Chapters and contributor counts derive from those fixtures. Page numbers follow canonical recipe order, including when filtering results.

## Review

Browse `/recipes`, open a recipe and use the page arrows. Compare desktop with a narrow mobile screen. The branch keeps the marketing landing page separate from this experiment.

Browser checks cover 320, 390, 768, 1024 and 1440 pixels; chapters, ingredient search, empty states, bookmark persistence, ingredient checklists, recipe navigation, contribution entry and the legacy collection address.
