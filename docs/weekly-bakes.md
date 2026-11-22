# Weekly bakes

The weekly bake is a shared club activity with two editorial formats:

- **Open theme:** a prompt such as “Something with apples.” Any relevant bake can participate. The recipe book is optional inspiration.
- **Featured recipe:** a specific shared-book recipe is the centrepiece. Participation uses the existing recipe-attempt editor.

## Pages and discovery

`/weekly` redirects to the selected current edition. `/weekly/[id]` shows the edition, its format and date label, contributions, and links to other editions. Home links to the current week from its header and right rail. The initial current edition is the apple theme; the cinnamon-bun edition demonstrates the archive and featured-recipe layout.

Selection is manual through `activeWeekId` in `src/data/weekly-bakes.ts`, independent of the visitor’s clock. This prototype has no automatic scheduler or administration screen. To run a featured-recipe week, select that edition as active; its recipe and participation links then use the weekly attempt context. Other editions remain available to browse, without adding new weekly contributions.

## One contribution, multiple places

Theme contributions are canonical bake posts with a `weekId`; the same content, reactions and comments appear in Home, post detail and the weekly page. The sample apple bake demonstrates this without creating a second post. Create receives the theme through `?type=bake&week=...`, displays its context and preserves the association in the existing browser draft. It still saves a draft rather than publishing a community post.

Featured-recipe participation passes `?week=...` to the existing recipe page. The server checks that the edition is current and features that recipe. Saving an attempt adds the edition to its `weekIds` metadata. Ordinary recipe attempts are not automatically assigned by their date. Editing an attempt outside the weekly context preserves its associations. The same attempt can belong to multiple editions; it remains one editable note per baker per recipe, rather than an immutable attempt history. Removing that attempt removes it from its linked editions too.

The weekly view filters attempts by explicit edition membership. Archived recipe weeks show those contributions and link back to the recipe; trying an archived recipe through its ordinary page does not add the new attempt to that past week. Sample data is illustrative.

## State and limits

The existing `crumb-club:draft:v1` and `crumb-club:kitchen-tries:v1` keys remain in use. Previous entries without weekly metadata still restore. Weekly metadata is optional and sanitised; outgoing recipe associations are checked against the current edition and its recipe. Browser-storage restrictions retain the existing in-memory fallback for attempts.

There are no rankings, winners, joining requirements or separate duplicate posts. Public publishing, a shared backend, automatic week rollover and an immutable history of repeated attempts remain future work.

## Verification

Twenty automated tests cover existing content and activity selection, recipe-attempt validation, weekly format identities, canonical post links and optional metadata compatibility. Responsive browser checks exercise both editions at 320, 390, 768 and 1440 pixels, theme-draft restoration, archive isolation and featured-recipe attempt attribution. Production compilation and TypeScript are checked separately.

## Photograph

Apple-pie photograph: Unsplash image `1568571780765-9276ac8b75a2`, served locally as `public/images/apple-bake.jpg`. Existing cinnamon-bun photographs are reused.
