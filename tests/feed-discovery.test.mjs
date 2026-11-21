import test from "node:test";
import assert from "node:assert/strict";
import {
  socialPosts,
  recipes,
  feedItems,
  followedAuthorIds,
  resolveFeedItem,
  getPost,
} from "../src/data/content.ts";
import { selectHomeFeed } from "../src/features/community/feed-selection.ts";
import { matchesCategory } from "../src/features/community/classification.ts";

test("For you mixes all publishing types in chronological order", () => {
  const mixed = selectHomeFeed(feedItems, socialPosts, recipes);
  assert.equal(mixed.length, feedItems.length);
  const kinds = new Set(
    mixed.map((item) =>
      item.kind === "recipe" ? "recipe" : getPost(item.postId).kind,
    ),
  );
  assert.deepEqual([...kinds].sort(), [
    "bake",
    "discovery",
    "general",
    "recipe",
  ]);
  const dates = mixed.map((item) => resolveFeedItem(item).publishedAt);
  assert.deepEqual(dates, [...dates].sort().reverse());
  assert.equal(mixed[0].postId, "rainy-day");
});

test("Following uses only mock followed authors and has a real empty case", () => {
  const following = selectHomeFeed(
    feedItems,
    socialPosts,
    recipes,
    true,
    followedAuthorIds,
  );
  assert.ok(following.length > 0 && following.length < feedItems.length);
  assert.ok(
    following.every((item) =>
      followedAuthorIds.includes(resolveFeedItem(item).author.id),
    ),
  );
  assert.ok(following.some((item) => item.kind === "recipe"));
  assert.deepEqual(
    selectHomeFeed(feedItems, socialPosts, recipes, true, []),
    [],
  );
});

test("category discovery finds a bake and independent recipe without classifying general posts", () => {
  const content = [...socialPosts, ...recipes];
  const cookies = content.filter((resource) =>
    matchesCategory(resource, "Cookies"),
  );
  assert.equal(cookies.length, 2);
  assert.ok(
    cookies.some((resource) => "kind" in resource && resource.kind === "bake"),
  );
  assert.ok(cookies.some((resource) => !("kind" in resource)));
  const ordinary = getPost("rainy-day");
  assert.equal(matchesCategory(ordinary, "Cookies"), false);
  assert.equal(matchesCategory(ordinary, ""), true);
  assert.ok(
    selectHomeFeed(feedItems, socialPosts, recipes).some(
      (item) => item.kind === "post" && item.postId === ordinary.id,
    ),
  );
});

test("baked categories, recipe links and bakery tags remain valid", () => {
  assert.ok(socialPosts.some((post) => post.kind === "bake" && !post.recipeId));
  assert.ok(
    socialPosts
      .filter((post) => post.kind === "bake" && post.recipeId)
      .every((post) => recipes.some((recipe) => recipe.id === post.recipeId)),
  );
  assert.ok(matchesCategory(getPost("little-bakery"), "bakeries"));
  assert.ok(!matchesCategory(getPost("rainy-day"), "bakeries"));
  assert.ok(recipes.every((recipe) => matchesCategory(recipe, "recipes")));
});
