import type { FeedItem, Post, Recipe } from "./types";
export function selectHomeFeed(
  items: readonly FeedItem[],
  posts: readonly Post[],
  recipes: readonly Recipe[],
  following = false,
  followedIds: readonly string[] = [],
): FeedItem[] {
  const resource = (item: FeedItem) =>
    item.kind === "post"
      ? posts.find((post) => post.id === item.postId)
      : recipes.find((recipe) => recipe.id === item.recipeId);
  return items
    .filter((item) => {
      const content = resource(item);
      return (
        !!content && (!following || followedIds.includes(content.author.id))
      );
    })
    .sort((a, b) =>
      (resource(b)?.publishedAt ?? "").localeCompare(
        resource(a)?.publishedAt ?? "",
      ),
    );
}
