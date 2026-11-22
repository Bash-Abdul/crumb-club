import test from "node:test";
import assert from "node:assert/strict";
import {
  bakeWeeks,
  activeBakeWeek,
  getBakeWeek,
  isWeeklyRecipe,
} from "../src/data/weekly-bakes.ts";
import { socialPosts, getRecipe } from "../src/data/content.ts";
import { readKitchenTries } from "../src/features/recipe-book/kitchen-tries.ts";
test("weekly editions distinguish open themes from one specific recipe", () => {
  assert.equal(new Set(bakeWeeks.map((w) => w.id)).size, bakeWeeks.length);
  assert.equal(getBakeWeek(activeBakeWeek.id), activeBakeWeek);
  for (const week of bakeWeeks) {
    if (week.format === "recipe") {
      assert.ok(getRecipe(week.recipeId));
      assert.ok(isWeeklyRecipe(week.id, week.recipeId));
      assert.equal(isWeeklyRecipe(week.id, "other-recipe"), false);
    } else {
      assert.equal(week.recipeId, undefined);
      assert.equal(isWeeklyRecipe(week.id, "cinnamon-buns"), false);
    }
  }
  assert.equal(getBakeWeek("missing"), undefined);
});
test("weekly bake posts retain their own canonical content identity", () => {
  const attached = socialPosts.filter((p) => p.kind === "bake" && p.weekId);
  assert.ok(attached.length);
  for (const post of attached)
    assert.equal(getBakeWeek(post.weekId)?.format, "theme");
});
test("attempt restoration keeps optional weekly metadata without changing legacy entries", () => {
  const note = {
    note: "A little more cinnamon.",
    updatedAt: "2026-11-14T12:00:00Z",
  };
  const restored = readKitchenTries(
    {
      "cinnamon-buns": {
        ...note,
        weekIds: ["cinnamon-together", "cinnamon-together"],
      },
    },
    ["cinnamon-buns"],
  );
  assert.deepEqual(restored["cinnamon-buns"].weekIds, ["cinnamon-together"]);
  assert.deepEqual(
    readKitchenTries({ "cinnamon-buns": note }, ["cinnamon-buns"])[
      "cinnamon-buns"
    ],
    note,
  );
  assert.equal(
    readKitchenTries({ "cinnamon-buns": { ...note, weekIds: { bad: true } } }, [
      "cinnamon-buns",
    ])["cinnamon-buns"].weekIds,
    undefined,
  );
});
