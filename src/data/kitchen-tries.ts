import type { KitchenTry } from "@/features/recipe-book/kitchen-tries";

// Sample recipe attempts, separate from questions and comments.
export const sampleKitchenTries: KitchenTry[] = [
  {
    recipeId: "lemon-cake",
    authorId: "james",
    note: "Added lemon zest to the sponge and took them to a picnic. They travelled beautifully in the tin.",
    updatedAt: "2026-11-20T14:00:00Z",
  },
  {
    recipeId: "lemon-cake",
    authorId: "noor",
    note: "My first go at buttercream. Ten minutes in the fridge made it much easier to pipe. Keeping this one.",
    updatedAt: "2026-11-19T16:30:00Z",
  },
  {
    recipeId: "cinnamon-buns",
    authorId: "noor",
    note: "Left a little more room between the buns this time. Soft middles, crisp edges. Worth the slow afternoon.",
    photo: "/images/buns-table.jpg",
    updatedAt: "2026-11-20T15:00:00Z",
  },
  {
    recipeId: "cinnamon-buns",
    authorId: "james",
    note: "My kitchen was chilly, so the first rise took an extra half hour. Waiting until the dough doubled made all the difference.",
    updatedAt: "2026-11-18T17:00:00Z",
  },
  {
    recipeId: "chocolate-chip-cookies",
    authorId: "sophie",
    note: "Chilled the dough overnight and baked half the batch the next day. A tiny pinch of flaky salt on top is lovely.",
    updatedAt: "2026-11-20T12:00:00Z",
  },
];
