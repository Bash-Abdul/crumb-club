import type { FeedItem, Post, Recipe } from "./types";
export const homeFilters = [
  "all",
  "bakes",
  "recipes",
  "finds",
  "conversations",
  "saved",
] as const;
export type HomeFilter = (typeof homeFilters)[number];
export function readHomeFilter(value: unknown): HomeFilter {
  return homeFilters.find((item) => item === value) ?? "all";
}
export function selectHomeFeed(
  items: readonly FeedItem[],
  posts: readonly Post[],
  recipes: readonly Recipe[],
  filter: HomeFilter = "all",
): FeedItem[] {
  const resource = (item: FeedItem) =>
    item.kind === "post"
      ? posts.find((post) => post.id === item.postId)
      : recipes.find((recipe) => recipe.id === item.recipeId);
  const unique = new Map(
    items.map((item) => [
      item.kind === "post" ? `post:${item.postId}` : `recipe:${item.recipeId}`,
      item,
    ]),
  );
  return [...unique.values()]
    .filter((item) => {
      const content = resource(item);
      if (!content) return false;
      if (filter === "recipes") return item.kind === "recipe";
      if (filter === "bakes")
        return "kind" in content && content.kind === "bake";
      if (filter === "finds")
        return "kind" in content && content.kind === "discovery";
      if (filter === "conversations")
        return "kind" in content && content.kind === "general";
      return true;
    })
    .sort((a, b) =>
      (resource(b)?.publishedAt ?? "").localeCompare(
        resource(a)?.publishedAt ?? "",
      ),
    );
}
export function arrangeHomeGrid(
  items: readonly FeedItem[],
  posts: readonly Post[],
) {
  const post = (item: FeedItem) =>
    item.kind === "post"
      ? posts.find((post) => post.id === item.postId)
      : undefined;
  const feature = items.find((item) => post(item)?.kind === "bake");
  const find = items.find((item) => post(item)?.kind === "discovery");
  const conversation = items.find(
    (item) => post(item)?.kind === "general" && !post(item)?.images?.length,
  );
  const recipe = items.find((item) => item.kind === "recipe");
  const selected = [feature, find, conversation, recipe].filter(
    (item): item is FeedItem => !!item,
  );
  return {
    feature,
    find,
    conversation,
    recipe,
    rest: items.filter((item) => !selected.includes(item)),
  };
}
