import type { BakingCategory } from "@/data/categories";
export interface Author {
  id: string;
  name: string;
  initials: string;
  bio: string;
}
export interface ContentImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  position?: string;
}
export interface Comment {
  id: string;
  author: string;
  initials: string;
  text: string;
}
interface SocialPostBase {
  id: string;
  author: Author;
  time: string;
  publishedAt: string;
  likes: number;
  comments: Comment[];
}
export interface BakePost extends SocialPostBase {
  title?: string;
  kind: "bake";
  images: [ContentImage, ...ContentImage[]];
  category?: BakingCategory;
  caption?: string;
  recipeId?: string;
}
export interface DiscoveryPost extends SocialPostBase {
  title?: string;
  kind: "discovery";
  images?: ContentImage[];
  category?: BakingCategory;
  tags?: string[];
  caption: string;
  location?: string;
}
export interface GeneralPost extends SocialPostBase {
  kind: "general";
  caption: string;
  images?: ContentImage[];
}
export type Post = GeneralPost | BakePost | DiscoveryPost;
export interface Recipe {
  id: string;
  title: string;
  description: string;
  author: Author;
  time: string;
  publishedAt: string;
  category?: BakingCategory;
  cover: ContentImage;
  additionalImages?: ContentImage[];
  ingredients: string[];
  steps: string[];
  prep?: string;
  bake?: string;
  yield?: string;
  note?: string;
  likes: number;
  comments: Comment[];
}
export type FeedItem =
  { kind: "post"; postId: string } | { kind: "recipe"; recipeId: string };
export interface ReactionTarget {
  id: string;
  label: string;
  href: string;
  likes: number;
  comments: Comment[];
}
export interface PostActivity {
  liked: boolean;
  saved: boolean;
  comments: Comment[];
}
export type Activity = Record<string, PostActivity>;
