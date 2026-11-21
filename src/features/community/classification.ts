import type { Post, Recipe } from "./types";
export function matchesCategory(
  content: Post | Recipe,
  category: string,
): boolean {
  if (!category) return true;
  const value = category.toLowerCase();
  if (value === "recipes") return !("kind" in content);
  if (value === "bakeries")
    return (
      "kind" in content &&
      content.kind === "discovery" &&
      (content.tags ?? []).some((tag) => tag.toLowerCase() === "bakery")
    );
  return "category" in content && content.category?.toLowerCase() === value;
}
