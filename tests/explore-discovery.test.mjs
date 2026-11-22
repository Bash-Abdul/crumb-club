import test from "node:test";
import assert from "node:assert/strict";
import { externalDiscoveries } from "../src/data/external-discoveries.ts";
import {
  socialPosts,
  recipes,
  getPost,
  getRecipe,
} from "../src/data/content.ts";
import {
  matchesExploreCategory,
  selectExternalDiscoveries,
} from "../src/features/explore/discovery-selection.ts";
test("Cookies combines community bakes and cookbook recipes with outside resources", () => {
  const community = [...socialPosts, ...recipes].filter((item) =>
    matchesExploreCategory(item, "Cookies"),
  );
  assert.ok(community.some((item) => "kind" in item && item.kind === "bake"));
  assert.ok(community.some((item) => !("kind" in item)));
  const outside = selectExternalDiscoveries(externalDiscoveries, "Cookies", "");
  assert.ok(outside.some((item) => item.type === "book"));
  assert.ok(outside.some((item) => item.type === "guide"));
  assert.ok(outside.every((item) => item.topics.includes("Cookies")));
});
test("editorial topics allow relevant conversations without reclassifying general posts", () => {
  const post = getPost("kitchen-sunshine");
  assert.equal(post.kind, "general");
  assert.equal(post.category, undefined);
  assert.ok(matchesExploreCategory(post, "Cupcakes"));
  assert.ok(matchesExploreCategory(post, "Bread"));
  assert.equal(matchesExploreCategory(getPost("rainy-day"), "Cookies"), false);
  assert.ok(matchesExploreCategory(getPost("little-bakery"), "Bakeries"));
  assert.equal(matchesExploreCategory(post, "Recipes"), false);
});
test("outside resources never become cookbook entries or baker-owned contributions", () => {
  assert.deepEqual(
    selectExternalDiscoveries(externalDiscoveries, "Recipes", ""),
    [],
  );
  assert.deepEqual(
    selectExternalDiscoveries(externalDiscoveries, "", "", "sophie"),
    [],
  );
  assert.ok(
    externalDiscoveries.every(
      (item) => !getRecipe(item.id) && !getPost(item.id),
    ),
  );
});
test("outside search matches sources, subjects and metadata and handles empty categories", () => {
  assert.ok(
    selectExternalDiscoveries(externalDiscoveries, "", " CLAIRE ").some(
      (item) => item.id === "dessert-person",
    ),
  );
  assert.ok(
    selectExternalDiscoveries(externalDiscoveries, "Bread", "tangzhong").some(
      (item) => item.id === "tangzhong",
    ),
  );
  assert.deepEqual(
    selectExternalDiscoveries(externalDiscoveries, "Pancakes", ""),
    [],
  );
  assert.deepEqual(
    selectExternalDiscoveries(externalDiscoveries, "", "nothing-like-this"),
    [],
  );
});
test("curated resources have unique IDs, real HTTPS destinations and attributed local imagery", () => {
  assert.equal(
    new Set(externalDiscoveries.map((item) => item.id)).size,
    externalDiscoveries.length,
  );
  for (const item of externalDiscoveries) {
    const url = new URL(item.url);
    assert.equal(url.protocol, "https:");
    assert.ok(item.image.src.startsWith("/images/"));
    assert.ok(item.image.attribution);
    assert.ok(item.source && item.description && item.topics.length);
  }
});
