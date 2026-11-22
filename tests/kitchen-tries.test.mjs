import test from "node:test";
import assert from "node:assert/strict";
import {
  readKitchenTries,
  recipeKitchenTries,
  KITCHEN_NOTE_LIMIT,
  KITCHEN_PHOTO_LIMIT,
} from "../src/features/recipe-book/kitchen-tries.ts";
const date = "2026-11-21T12:00:00Z";
const ids = ["buns", "cookies"];
const samples = [
  {
    recipeId: "buns",
    authorId: "sophie",
    note: "Soft middles!",
    updatedAt: date,
  },
  {
    recipeId: "buns",
    authorId: "sophie",
    note: "An updated note",
    updatedAt: date,
  },
  {
    recipeId: "buns",
    authorId: "james",
    note: "Worth the wait",
    updatedAt: date,
  },
  {
    recipeId: "cookies",
    authorId: "sophie",
    note: "A different recipe",
    updatedAt: date,
  },
];
test("tries count distinct kitchens per recipe, including when someone updates their note", () => {
  assert.equal(recipeKitchenTries("buns", samples, {}, "you").length, 2);
  const local = readKitchenTries(
    { buns: { note: "First attempt", updatedAt: date } },
    ids,
  );
  assert.equal(recipeKitchenTries("buns", samples, local, "you").length, 3);
  const updated = {
    ...local,
    buns: { note: "Made it again", updatedAt: date },
  };
  const tries = recipeKitchenTries("buns", samples, updated, "you");
  assert.equal(tries.length, 3);
  assert.equal(tries[0].note, "Made it again");
  assert.equal(tries.filter((entry) => entry.authorId === "you").length, 1);
  assert.equal(
    recipeKitchenTries("cookies", samples, updated, "you").length,
    1,
  );
  delete updated.buns;
  assert.equal(recipeKitchenTries("buns", samples, updated, "you").length, 2);
});
test("a try can have no note or photo, and valid notes are trimmed", () => {
  const result = readKitchenTries(
    {
      buns: { note: "", updatedAt: date },
      cookies: { note: "  Orange zest!  ", updatedAt: date },
    },
    ids,
  );
  assert.equal(Object.keys(result).length, 2);
  assert.equal(result.buns.note, "");
  assert.equal(result.cookies.note, "Orange zest!");
});
test("stored tries reject unknown recipes, malformed entries and oversized notes", () => {
  assert.deepEqual(readKitchenTries(null, ids), {});
  assert.deepEqual(readKitchenTries([], ids), {});
  for (const entry of [
    [],
    null,
    { note: 4, updatedAt: date },
    { note: "fine", updatedAt: "invalid" },
    { note: "x".repeat(KITCHEN_NOTE_LIMIT + 1), updatedAt: date },
  ]) {
    assert.deepEqual(readKitchenTries({ buns: entry }, ids), {});
  }
  assert.deepEqual(
    readKitchenTries({ unknown: { note: "valid", updatedAt: date } }, ids),
    {},
  );
});
test("local photos accept supported image data and reject external or executable sources", () => {
  const photo = "data:image/webp;base64,AAAA";
  assert.equal(
    readKitchenTries({ buns: { note: "", photo, updatedAt: date } }, ids).buns
      .photo,
    photo,
  );
  for (const invalid of [
    "https://example.com/photo.jpg",
    "javascript:alert(1)",
    "data:image/svg+xml;base64,AAAA",
    "data:text/html;base64,AAAA",
    photo + "x".repeat(KITCHEN_PHOTO_LIMIT),
  ]) {
    assert.deepEqual(
      readKitchenTries(
        { buns: { note: "", photo: invalid, updatedAt: date } },
        ids,
      ),
      {},
    );
  }
});
