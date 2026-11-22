import type { Author, FeedItem } from "@/features/community/types";
import { socialPosts, recipes, resolveFeedItem } from "./content";
export const CURRENT_BAKER_ID = "you";
export interface Baker extends Author {
  handle: string;
  avatar?: string;
}
const handles: Record<string, string> = {
  sophie: "sophiebakes",
  amelia: "ameliabakes",
  james: "jamesfinds",
  noor: "noorscrumbs",
};
// Every community member is a baker, regardless of what they share.
export const bakers: Baker[] = Array.from(
  new Map(
    [...socialPosts, ...recipes].map((content) => [
      content.author.id,
      content.author,
    ]),
  ).values(),
).map((author) => ({ ...author, handle: handles[author.id] ?? author.id }));
// A small introduction to the community, without popularity rankings.
export const clubBakers = bakers;
export function profileHref(id: string) {
  if (id === CURRENT_BAKER_ID) return "/profile";
  const baker = bakers.find((person) => person.id === id);
  return baker ? `/profile/${baker.handle}` : "/profile";
}
export function getPublishedItems(id: string): FeedItem[] {
  return [
    ...socialPosts
      .filter((post) => post.author.id === id)
      .map((post): FeedItem => ({ kind: "post", postId: post.id })),
    ...recipes
      .filter((recipe) => recipe.author.id === id)
      .map((recipe): FeedItem => ({ kind: "recipe", recipeId: recipe.id })),
  ].sort((a, b) =>
    (resolveFeedItem(b)?.publishedAt ?? "").localeCompare(
      resolveFeedItem(a)?.publishedAt ?? "",
    ),
  );
}
