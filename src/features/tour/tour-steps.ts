export const tourSteps = [
  {
    target: "home",
    title: "Pull up a chair.",
    text: "This is your corner of the club: good bakes, little discoveries and people who enjoy them. Let’s find your way around.",
  },
  {
    target: "filters",
    title: "Follow your appetite.",
    text: "Browse bakes, recipes, little finds or conversations. All brings everything back together.",
  },
  {
    target: "recipe-book",
    title: "A book we all add to.",
    text: "Open the shared recipe book, keep a favourite, or tell the club how your own attempt went.",
  },
  {
    target: "saved",
    title: "Keep a little for later.",
    text: "Save the recipes and posts you want to come back to. Your favourites will be waiting here.",
  },
  {
    target: "composer",
    title: "Something to share?",
    text: "A proud bake, a question, a recipe or a bakery discovery. Start here—even the happy accidents belong.",
  },
  {
    target: "search",
    title: "Find your next good thing.",
    text: "Search for a recipe, a baker or a little discovery. A good place to start when you know what you’re craving.",
  },
  {
    target: "profile",
    title: "Make yourself at home.",
    text: "Your contributions, recipes tried and saved favourites live in your profile. You can change your companion or replay this tour there, too.",
  },
] as const;
export type TourStatus = "complete" | "skipped" | null;
export function readTourStatus(value: unknown): TourStatus {
  return value === "complete" || value === "skipped" ? value : null;
}
export function clampTourStep(value: number) {
  return Number.isFinite(value)
    ? Math.max(0, Math.min(tourSteps.length - 1, Math.trunc(value)))
    : 0;
}
