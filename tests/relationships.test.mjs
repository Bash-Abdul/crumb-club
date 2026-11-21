import test from "node:test";
import assert from "node:assert/strict";
import {
  normaliseFollowing,
  toggleFollowing,
  relationshipCounts,
} from "../src/features/profiles/relationships.ts";
import { selectHomeFeed } from "../src/features/community/feed-selection.ts";
import {
  socialPosts,
  recipes,
  feedItems,
  resolveFeedItem,
} from "../src/data/content.ts";
const known = ["sophie", "amelia", "james", "noor"];

test("stored relationships reject self, duplicates, unknown bakers and invalid values", () => {
  assert.deepEqual(
    normaliseFollowing(
      ["you", "sophie", "sophie", "unknown", null, 42],
      "you",
      known,
    ),
    ["sophie"],
  );
  assert.deepEqual(normaliseFollowing(null, "you", known), []);
  assert.deepEqual(toggleFollowing(["sophie"], "you", "you", known), [
    "sophie",
  ]);
  assert.deepEqual(toggleFollowing(["sophie"], "unknown", "you", known), [
    "sophie",
  ]);
});
test("follow and unfollow form one relationship and update the chronological feed", () => {
  const followed = toggleFollowing([], "james", "you", known);
  assert.deepEqual(followed, ["james"]);
  const following = selectHomeFeed(
    feedItems,
    socialPosts,
    recipes,
    true,
    followed,
  );
  assert.ok(following.length > 0);
  assert.ok(
    following.every((item) => resolveFeedItem(item).author.id === "james"),
  );
  const unfollowed = toggleFollowing(followed, "james", "you", known);
  assert.deepEqual(unfollowed, []);
  assert.deepEqual(
    selectHomeFeed(feedItems, socialPosts, recipes, true, unfollowed),
    [],
  );
});
test("follower/following counts derive consistently from unique non-self edges", () => {
  const base = [{ followerId: "amelia", followingId: "james" }];
  const edges = [
    ...base,
    { followerId: "you", followingId: "james" },
    { followerId: "you", followingId: "james" },
    { followerId: "you", followingId: "you" },
  ];
  assert.deepEqual(relationshipCounts("james", edges), {
    followers: 2,
    following: 0,
  });
  assert.deepEqual(relationshipCounts("you", edges), {
    followers: 0,
    following: 1,
  });
  assert.equal(relationshipCounts("james", base).followers, 1);
});
