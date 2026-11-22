# Explore: a window into the wider baking world

This refinement preserves the existing Follow your cravings heading, subtitle, category cards, original two community tiles, saves and editorial bakery feature. It adds an editorial reading corner and a small member introduction, without changing Home, navigation, profiles or the shared cookbook.

## Composition and interactions

- **Fresh from the community** retains the cinnamon-bun bake and vanilla-cupcake recipe. A compact note links to Noor’s existing kitchen conversation, rather than repeating Home’s full feed.
- **Worth a little look** pairs a prominent cookbook with compact technique and reading discoveries. The actual cookbook cover comes from its publisher. Food photographs illustrate subjects; they are not represented as images from the linked articles.
- **A very good little find** retains James’s member-authored bakery story, clearly labelled as community content. A separate, source-labelled e5 Bakehouse recommendation opens the bakery’s own website. In filtered results, its illustrative photograph is explicitly labelled as not depicting that bakery.
- **Meet the club** links three existing members’ avatars, names and bios to their profiles. It has no ranking or following controls.

All external links show their source and external affordance, open the original destination in a new tab and use `noopener noreferrer`. External resources have no simulated reactions, saves or cookbook-import actions. Existing community saves and detail links are unchanged.

## Data

`src/data/external-discoveries.ts` is a manually curated local array with five resources: one cookbook, two guides, one article and one bakery. Each entry has an ID, editorial title and introduction, image/alt/attribution, type, label, topics, source, original HTTPS URL and optional metadata.

Destinations were checked on 22 November 2026:

- [Dessert Person, Penguin Random House](https://www.penguinrandomhouse.com/books/609892/dessert-person-by-claire-saffitz/)
- [Tangzhong beyond white bread, King Arthur Baking](https://www.kingarthurbaking.com/blog/2018/10/10/tangzhong-beyond-white-bread)
- [Decorating cookies, King Arthur Baking](https://www.kingarthurbaking.com/learn/guides/cookie-decorating)
- [Make your best cookies with these 10 tips, King Arthur Baking](https://www.kingarthurbaking.com/blog/2023/09/27/best-cookie-tips)
- [e5 Bakehouse](https://e5bakehouse.com/)

The publisher’s cover image is served locally at `public/images/dessert-person.jpg`. Other photographs reuse the existing library. No source text, recipes or article bodies are copied into the community cookbook.

## Category and search behaviour

Explore reuses canonical posts and recipes and the existing category list. Its small `communityTopics` map adds Cupcakes and Bread to Noor’s existing kitchen post, based on the content and photographs. This metadata is specific to discovery: the post remains a general post, with no required title or new post type. Existing baked categories and discovery tags also participate.

Category filters can show community bakes, cookbook recipes, relevant general posts, bakery finds and external resources. Search checks titles, text, sources, topics and resource metadata. The Recipes filter remains community cookbook content only. A baker-specific URL shows that baker’s contributions and excludes unrelated external resources. Matching local recipe attempts appear under From your kitchen, linked to their original recipe notes.

A category with external matches but no club content gets a short community empty state and the external results. A completely empty selection gets the existing mascot empty state and a clear route back to all discoveries. Searchable member results are retained.

## Verification and limits

Twenty-five tests cover the content model, existing feed/tour/weekly logic, mixed category discovery, general-post topics, source search, cookbook separation and external data structure. Browser checks cover 320, 390, 768, 1024 and 1440 pixels, the curated composition, category and source search, saved-state persistence, local attempts, baker/recipe filtering, More categories and empty states. Screenshots were reviewed on desktop and mobile. TypeScript and production compilation are checked separately.

Curation and tags are manual. There is no runtime scraping, CMS, remote API, backend or recommendation system. External availability can change after verification. Community contributions and member biographies remain sample data; recipe attempts and saves use the existing browser-local state. Browser tooling is temporary rather than a committed regression suite.
