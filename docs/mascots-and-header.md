# Account header and personal mascots

Branch: `design/community-recipe-book`.

The duplicate sidebar profile block has been removed. The app header now provides a club search, notifications button and profile link showing the current baker’s initials. Mobile keeps these controls beside the wordmark; search expands into a second row.

Search opens `/explore?q=…`. Results include posts, recipes and matching baker names/handles. Category filters preserve the search term. The notification popover has keyboard dismissal, outside-click dismissal and an empty state using the chosen mascot. It does not fabricate notifications or unread counts; live activity notifications are not implemented yet.

## Mascot choice

Onboarding has four steps: name, baking vibe, interests and mascot. The options are The Croissant, The Cookie, The Baker and The Crumb. The choice is stored independently under `crumb-club:mascot:v1`, so existing preferences, profiles, follows and recipe attempts remain compatible. The Crumb is the default for visitors and existing users who have not chosen yet.

The selected character appears in the sidebar, tablet navigation rail, mobile Home heading, notifications, and empty states for Saved, Explore, profiles and the recipe book. The user can change it in their own profile. Blocked storage retains the choice for the current visit with a notice. Server-rendered and hydration snapshots use the same default before browser preferences load.

## Character assets

Generated using the built-in image-generation tool, with the user-supplied mascot concept board as the reference. Transparent source PNGs are committed in the project; the mascot component uses Next.js Image Optimization for responsive delivery.

- `public/mascots/croissant.png`
- `public/mascots/cookie.png`
- `public/mascots/baker.png`
- `public/mascots/crumb.png`

Common generation prompt:

> Create one standalone UI mascot asset for the Crumb Club web app by isolating and carefully redrawing just the specified character from the provided mascot concept board. Reference role: the attached board supplies the exact character design and warm bakery illustration style. Preserve the reference’s hand-drawn warm cocoa outlines, butter-yellow and caramel colours, very subtle warm shading, simple cute proportions and restrained friendly personality. Flat clean professional character illustration, crisp edges legible at 64px, front-facing, centred, full character visible with comfortable transparent padding. A single character only, no board, no labels, no lettering, no badges, no background, no floor shadow, no extra characters. Output a genuinely transparent PNG.

Character-specific targets appended to that prompt:

- **Croissant:** curved golden croissant, plump segmented crescent, chocolate-brown dot eyes, smiling mouth and soft apricot cheeks.
- **Cookie:** round golden chocolate-chip biscuit, uneven chocolate chips, chocolate-brown dot eyes, smiling mouth and apricot cheeks.
- **Baker:** slice of bread with creamy golden centre, browned crust, white chef hat, smiling face and apricot cheeks.
- **Crumb:** low rounded scalloped mound of golden crumb, smiling face, apricot cheeks and two or three tiny crumbs beside it; no chef hat or utensils.

## Verification

Browser checks cover the four-step onboarding flow, all four character choices, persisted preferences, content and baker search, category/query combinations, notification dismissal, profile navigation and responsive controls from 320px to desktop. Existing recipe-book state and interactions remain independent.
