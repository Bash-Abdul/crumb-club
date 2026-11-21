import { socialPosts, recipes, getRecipe, postLabel } from "./content";
export interface CommunityPost {
  id: string;
  category: string;
  title: string;
  story: string;
  author: string;
  initials: string;
  image: string;
  alt: string;
  likes: number;
}
export const posts: CommunityPost[] = [
  {
    id: "sunday-buns",
    category: "FRESH FROM THE OVEN",
    title: "Slow Sundays, sticky fingers.",
    story:
      "My first cinnamon buns. A little wonky, a lot of cinnamon. Would absolutely make again.",
    author: "Sophie M.",
    initials: "SM",
    image: "/images/buns.jpg",
    alt: "Freshly baked cinnamon buns topped with pearl sugar",
    likes: 128,
  },
  {
    id: "little-bakery",
    category: "A GOOD LITTLE FIND",
    title: "The kind of place you keep coming back to.",
    story: "Followed the smell of warm bread and found a new Saturday ritual.",
    author: "James L.",
    initials: "JL",
    image: "/images/bakery.jpg",
    alt: "Warm neighbourhood bakery with fresh bread on display",
    likes: 86,
  },
  {
    id: "lemon-cake",
    category: "FROM MY RECIPE BOOK",
    title: "A little sunshine, in cake form.",
    story:
      "The vanilla cupcakes that never make it to Monday. A family favourite, now yours too.",
    author: "Amelia R.",
    initials: "AR",
    image: "/images/cake.jpg",
    alt: "Homemade vanilla cupcakes with icing and colourful sprinkles",
    likes: 204,
  },
];

// Compatibility summaries keep existing marketing/discovery views unchanged.
// Full social and recipe entities live independently in content.ts.
export const allContentPreviews: CommunityPost[] = [
  ...socialPosts.map((post) => ({
    id: post.id,
    category:
      post.kind === "bake"
        ? "FRESH FROM THE OVEN"
        : post.kind === "discovery"
          ? "A GOOD LITTLE FIND"
          : "",
    title:
      posts.find((existing) => existing.id === post.id)?.title ??
      postLabel(post),
    story: post.caption ?? "",
    author: post.author.name,
    initials: post.author.initials,
    image: post.images?.[0]?.src ?? "",
    alt: post.images?.[0]?.alt ?? "",
    likes: post.likes,
  })),
  ...recipes.map((recipe) => ({
    id: recipe.id,
    category: "FROM MY RECIPE BOOK",
    title: recipe.title,
    story: recipe.description,
    author: recipe.author.name,
    initials: recipe.author.initials,
    image: recipe.cover.src,
    alt: recipe.cover.alt,
    likes: recipe.likes,
  })),
];
export function contentHref(content: Pick<CommunityPost, "id">) {
  return getRecipe(content.id)
    ? `/recipes/${content.id}`
    : `/posts/${content.id}`;
}
