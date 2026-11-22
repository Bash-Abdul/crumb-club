# Profiles and persistent following

Historical milestone: following has since been removed. See [Community grid and tour](community-grid-and-tour.md) for current behavior.

This milestone extends the existing Crumb Club profile rather than replacing it. The original profile intro, round avatar, typography, interest links, saved-content cards and empty-state styling remain. Public profiles use the same `DemoProfile` component as the current baker’s profile.

## Profile information and routes

Profiles now include a display name, handle, avatar or initials, optional bio, and Followers, Following and Published counts. These are small additions inside the existing intro, without a cover image or a new dashboard layout.

| Route                  | Baker                                                   |
| ---------------------- | ------------------------------------------------------- |
| `/profile`             | The current local demo baker.                           |
| `/profile/sophiebakes` | Sophie M.                                               |
| `/profile/ameliabakes` | Amelia R.                                               |
| `/profile/jamesfinds`  | James L.                                                |
| `/profile/noorscrumbs` | Noor K.                                                 |
| `/profile/you`         | Compatibility alias redirecting to the current profile. |

Unknown handles show a missing-baker page. The current demo identity uses the stable ID and handle `you`. Other handles are fixed mock metadata. This is not an authentication or username-registration system.

`src/data/bakers.ts` derives the shared baker records from the existing content authors and adds their handles. Everyone is a baker, including people who mainly share discoveries or memories. Public profiles display the matching baker’s actual bio and initials.

## Published content and private saves

The new Shared with the club section reuses the profile’s existing list/card styling. It lists all posts and independent recipes owned by the viewed baker, in chronological order. Counts and lists both derive from the canonical `author.id` relationships in `src/data/content.ts`; there are no duplicated profile-specific post arrays.

General posts, bakes, recipes and little finds link to their existing detail pages. Text-only posts use the existing initials-tile fallback. No extra content tabs have been introduced.

Own-profile interests remain available, with Edit your interests leading to the existing onboarding preferences. Public profiles can show categories derived from the baker’s published content.

Tucked away for later remains on the current profile and is labelled private. Public profiles never render that section or the current browser’s saved items. The existing Saved collection at `/app?feed=saved` remains available. This is frontend demo visibility; production privacy would require authenticated server-side access control.

The current baker has no published fixture content, so Published correctly shows zero. Existing Create drafts remain unpublished and are not counted as posts.

## Follow relationships

A shared `BakersProvider` owns the current baker’s follow state. Relationships have the familiar direction `{ followerId, followingId }`.

Other mock bakers have a small fixed edge list. The current baker’s edges derive from locally stored `followingIds`. Initial follows remain Sophie and Amelia, preserving the previous demo’s starting behaviour. Follower/following counts are calculated from unique edges rather than incremented separately.

The relationship helpers:

- Reject self-following.
- Discard duplicate or unknown IDs from storage.
- Add or remove one relationship per action.
- Derive consistent follower and following counts from unique non-self edges.

A Follow button changes immediately to Following, with an Unfollow accessible label. It appears on other bakers’ profiles and in the existing Popular bakers sidebar. Own profiles show Edit Profile instead; following yourself is also rejected in the state layer.

## Following feed and navigation

Following now reads the shared persisted IDs instead of the old fixed list. It uses the existing feed selector, components and chronological ordering. General posts, bakes, recipe activities and little finds remain supported. Changes from a profile or sidebar button update the feed immediately, and an empty state appears when nobody is followed.

Popular bakers keeps its existing sidebar structure, avatars and recipe shelf. Name/avatar links now open the baker’s profile, with a compact follow action alongside each suggestion. Recipe attribution links also open profiles.

Author names and avatars in feed headers, post/recipe details, author notes, captions, Explore attribution and recognised comments link to the corresponding profile. The current profile shortcut, composer avatar and Home greeting use the edited local identity. The main shell and feed layouts are preserved.

## Edit Profile

Edit Profile opens a small inline form within the existing page. It supports:

- A non-blank display name, up to 50 characters.
- An optional bio, up to 240 characters.
- An optional JPG, PNG or WebP avatar, up to 1 MB.
- Removing the avatar, saving changes, or cancelling without changes.

Avatars use the existing local-image approach: FileReader and a data URL stored in this browser. There is no upload service. Updated identity is reflected in the profile, shell, composer, greeting and local comment attribution. Interest preferences remain separate.

Handles are displayed but not editable. Name changes do not change profile URLs or content ownership IDs.

## Persistence

| Key                       | Contents                                     |
| ------------------------- | -------------------------------------------- |
| `crumb-club:following:v1` | Current baker’s normalised `followingIds`.   |
| `crumb-club:profile:v1`   | Local display name, bio and optional avatar. |

Stored data is validated before use. Loading guards prevent clicks before relationships restore. Blocked or full storage falls back to in-memory behaviour with a notice; changes then last only for the current visit.

The existing activity key, demo preferences and draft storage are unchanged. Likes, saves and comments retain their existing identities and schema. Follow/profile persistence is specific to this browser and origin; simultaneous tabs do not synchronise live.

## Verification

The production build and strict TypeScript checks pass. Twelve model tests include three relationship cases covering duplicate/self/invalid IDs, follow/unfollow effects on the chronological feed, and consistent counts from unique edges.

Browser checks verified:

- Sidebar discovery → public profile → owned content → follow → Following → unfollow → restored profile state.
- Immediate agreement between profile buttons, sidebar buttons, follower counts and the current following count.
- Reload persistence, nobody-followed empty state and immediate feed repopulation.
- Own-profile self-follow prevention and public-profile private-save exclusion.
- Name, bio and avatar editing, restoration, cancellation and identity reuse.
- Author name/avatar links, derived published counts, own-profile alias and unknown-handle fallback.
- Profile and Following layouts at 320, 390, 768, 1024 and 1440 pixels without horizontal overflow.
- Existing interests, malformed-profile fallback, duplicate/self-follow sanitisation and blocked-storage session behaviour.
- Existing likes, saves, comments and the recipe ingredient checklist after profile integration.

Desktop and mobile screenshots were reviewed. No runtime page errors were observed in these flows. No lint command is configured.

## Backend limitations

There is no authentication, server-authoritative follow graph, real-time global count, image hosting or handle availability checking. Mock followers are illustrative relationships, and the browser represents one fixed local identity. Public publishing, durable identity and server privacy enforcement remain future work. No messaging, notification or recommendation feature was added.
