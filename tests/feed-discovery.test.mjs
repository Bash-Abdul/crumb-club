import test from "node:test";
import assert from "node:assert/strict";
import {
  socialPosts,
  recipes,
  feedItems,
  resolveFeedItem,
  getPost,
} from "../src/data/content.ts";
import {
  selectHomeFeed,
  arrangeHomeGrid,
  readHomeFilter,
} from "../src/features/community/feed-selection.ts";
import { matchesCategory } from "../src/features/community/classification.ts";

test("All mixes all publishing types in chronological order", () => {
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

test("content filters separate bakes, recipes, finds and photo/text conversations", () => {
  const expected = { bakes: 4, recipes: 3, finds: 1, conversations: 2 };
  for (const [filter, count] of Object.entries(expected)) {
    const visible = selectHomeFeed(feedItems, socialPosts, recipes, filter);
    assert.equal(visible.length, count);
    if (filter === "recipes")
      assert.ok(visible.every((item) => item.kind === "recipe"));
    else
      assert.ok(
        visible.every(
          (item) =>
            getPost(item.postId).kind ===
            { bakes: "bake", finds: "discovery", conversations: "general" }[
              filter
            ],
        ),
      );
  }
  const conversations = selectHomeFeed(
    feedItems,
    socialPosts,
    recipes,
    "conversations",
  );
  assert.ok(conversations.some((item) => getPost(item.postId).images?.length));
  assert.ok(conversations.some((item) => !getPost(item.postId).images?.length));
});
test("grid arrangements include every contribution exactly once", () => {
  const selected = selectHomeFeed(feedItems, socialPosts, recipes);
  const grid = arrangeHomeGrid(selected, socialPosts);
  const arranged = [
    grid.feature,
    grid.find,
    grid.conversation,
    grid.recipe,
    ...grid.rest,
  ].filter(Boolean);
  assert.equal(arranged.length, selected.length);
  assert.equal(
    new Set(arranged.map((item) => JSON.stringify(item))).size,
    selected.length,
  );
  assert.equal(getPost(grid.feature.postId).kind, "bake");
  assert.equal(getPost(grid.find.postId).kind, "discovery");
});
test("legacy following and unknown filters safely resolve to All", () => {
  assert.equal(readHomeFilter("following"), "all");
  assert.equal(readHomeFilter("unknown"), "all");
  assert.equal(readHomeFilter(null), "all");
  assert.equal(readHomeFilter("saved"), "saved");
  const input = [
    ...feedItems,
    feedItems[0],
    { kind: "post", postId: "missing" },
  ];
  assert.equal(
    selectHomeFeed(input, socialPosts, recipes).length,
    feedItems.length,
  );
  assert.equal(input.length, feedItems.length + 2);
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
