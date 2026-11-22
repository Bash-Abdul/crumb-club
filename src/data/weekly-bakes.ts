type WeekBase = {
  id: string;
  dates: string;
  title: string;
  introduction: string;
  image: string;
  alt: string;
};
export type BakeWeek = WeekBase &
  (
    | { format: "theme"; recipeId?: never }
    | { format: "recipe"; recipeId: string }
  );
export const bakeWeeks: BakeWeek[] = [
  {
    id: "apple-days",
    format: "theme",
    dates: "16–22 November",
    title: "Something with apples.",
    introduction:
      "A crumble from home. A pastry you’ve been meaning to try. An apple cake with a slightly wonky middle. This week, take the theme wherever your kitchen leads.",
    image: "/images/apple-bake.jpg",
    alt: "A generous slice of golden apple pie on a plate",
  },
  {
    id: "cinnamon-together",
    format: "recipe",
    dates: "9–15 November",
    title: "Sophie’s cinnamon buns.",
    introduction:
      "One recipe, passed around the club. Same starting point, everyone’s own little twist. Soft middles, sticky fingers and a little something learned along the way.",
    recipeId: "cinnamon-buns",
    image: "/images/buns-table.jpg",
    alt: "Homemade cinnamon buns on a kitchen table",
  },
];
// Editorial selection, deliberately independent of the visitor’s clock.
export const activeWeekId = "apple-days";
export function getBakeWeek(id: string) {
  return bakeWeeks.find((week) => week.id === id);
}
export const activeBakeWeek = bakeWeeks.find(
  (week) => week.id === activeWeekId,
)!;
export function isWeeklyRecipe(weekId: unknown, recipeId: string) {
  const week = typeof weekId === "string" ? getBakeWeek(weekId) : undefined;
  return week?.format === "recipe" && week.recipeId === recipeId;
}
