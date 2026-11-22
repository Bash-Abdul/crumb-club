import test from "node:test";
import assert from "node:assert/strict";
import {
  socialPosts,
  recipes,
  feedItems,
  getPost,
  getRecipe,
} from "../src/data/content.ts";

test("social posts and recipes have distinct, stable identities and valid references", () => {
  const ids = [...socialPosts, ...recipes].map((resource) => resource.id);
  assert.equal(new Set(ids).size, ids.length, "reaction IDs must not collide");
  for (const post of socialPosts) {
    if (post.kind === "bake") assert.ok(post.images.length >= 1);
    if (post.kind === "general") assert.ok(!Object.hasOwn(post, "title"));
    else if (post.title !== undefined)
      assert.equal(typeof post.title, "string");
    assert.ok(!Object.hasOwn(post, "ingredients"));
    assert.ok(!Object.hasOwn(post, "steps"));
    if (post.kind === "bake" && post.recipeId)
      assert.ok(getRecipe(post.recipeId));
    if (post.kind === "discovery") assert.ok(!Object.hasOwn(post, "recipeId"));
  }
  for (const item of feedItems)
    assert.ok(
      item.kind === "post" ? getPost(item.postId) : getRecipe(item.recipeId),
    );
});

test("cupcakes are an independent recipe activity with no backing social post", () => {
  const recipe = getRecipe("lemon-cake");
  assert.ok(recipe);
  assert.equal(getPost(recipe.id), undefined);
  assert.ok(recipe.ingredients.length && recipe.steps.length);
  assert.ok(
    feedItems.some(
      (item) => item.kind === "recipe" && item.recipeId === recipe.id,
    ),
  );
  assert.equal(
    recipe.id,
    "lemon-cake",
    "retain the existing local activity key",
  );
});

test("fixtures demonstrate multi-image bakes, recipe-free discoveries and single-image bakes", () => {
  const buns = getPost("sunday-buns");
  assert.ok(buns.images.length >= 3);
  assert.equal(buns.recipeId, "cinnamon-buns");
  assert.ok(getPost("little-bakery").images.length >= 2);
  const plain = getPost("first-loaf");
  assert.equal(plain.images.length, 1);
  assert.equal(plain.recipeId, undefined);
});

test("multiple social posts can reference one independent recipe without owning it", () => {
  const original = getPost("sunday-buns");
  const another = {
    ...original,
    id: "another-bake",
    recipeId: original.recipeId,
  };
  assert.equal(getRecipe(another.recipeId), getRecipe(original.recipeId));
  assert.ok(!Object.hasOwn(original, "recipe"));
  assert.ok(!Object.hasOwn(getRecipe(original.recipeId), "postId"));
});

test("general posts accept text without images, titles, recipes or categories", () => {
  const textOnly = getPost("rainy-day");
  assert.equal(textOnly.kind, "general");
  assert.ok(textOnly.caption.length > 0);
  assert.equal(textOnly.images, undefined);
  for (const field of [
    "title",
    "category",
    "recipeId",
    "ingredients",
    "steps",
  ]) {
    assert.ok(!Object.hasOwn(textOnly, field));
  }
  assert.ok(getPost("kitchen-sunshine").images.length > 1);
});
