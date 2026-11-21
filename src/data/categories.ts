export const bakingCategories = [
  "Cakes",
  "Cookies",
  "Brownies",
  "Pastries",
  "Bread",
  "Cupcakes",
  "Pancakes",
] as const;
export type BakingCategory = (typeof bakingCategories)[number];
