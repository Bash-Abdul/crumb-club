import type { ExternalDiscovery } from "@/data/external-discoveries";
import type { Post, Recipe } from "@/features/community/types";
// Small editorial additions for content without a baked category. No automatic tagging.
export const communityTopics: Readonly<Record<string, readonly string[]>> = {
  "kitchen-sunshine": ["Cupcakes", "Bread"],
};
export function matchesExploreCategory(
  content: Post | Recipe,
  category: string,
) {
  if (!category) return true;
  const value = category.toLowerCase();
  if (value === "recipes") return !("kind" in content);
  if (value === "bakeries")
    return (
      "kind" in content &&
      content.kind === "discovery" &&
      (content.tags ?? []).some((tag) => tag.toLowerCase() === "bakery")
    );
  return (
    ("category" in content && content.category?.toLowerCase() === value) ||
    (communityTopics[content.id] ?? []).some(
      (topic) => topic.toLowerCase() === value,
    ) ||
    ("tags" in content &&
      (content.tags ?? []).some((tag) => tag.toLowerCase() === value))
  );
}
export function selectExternalDiscoveries(
  items: readonly ExternalDiscovery[],
  category: string,
  query: string,
  bakerId = "",
) {
  if (bakerId || category.toLowerCase() === "recipes") return [];
  const value = category.toLowerCase();
  const term = query.trim().toLowerCase();
  return items.filter(
    (item) =>
      (!value || item.topics.some((topic) => topic.toLowerCase() === value)) &&
      `${item.title} ${item.description} ${item.source} ${item.label} ${item.metadata ?? ""} ${item.topics.join(" ")}`
        .toLowerCase()
        .includes(term),
  );
}
