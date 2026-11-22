import Link from "next/link";
import { BookOpen, ChefHat, MapPin, MessageCircle } from "lucide-react";
import { profileHref } from "@/data/bakers";
import { getPost, getRecipe, postTarget, recipeTarget } from "@/data/content";
import { BakerAvatar } from "@/features/profiles/baker-avatar";
import { ImageGallery } from "./image-gallery";
import { PostActions } from "./post-actions";
import { Caption } from "./caption";
import type { FeedItem } from "./types";
export function GridCard({
  item,
  wide = false,
}: {
  item: FeedItem;
  wide?: boolean;
}) {
  const post = item.kind === "post" ? getPost(item.postId) : undefined;
  const recipe = item.kind === "recipe" ? getRecipe(item.recipeId) : undefined;
  if (!post && !recipe) return null;
  const author = (post ?? recipe)!.author;
  const href = post ? `/posts/${post.id}` : `/recipes/${recipe!.id}`;
  const label = recipe
    ? "Recipe"
    : post?.kind === "bake"
      ? "Bake"
      : post?.kind === "discovery"
        ? "Little find"
        : "Conversation";
  const Icon = recipe
    ? BookOpen
    : post?.kind === "bake"
      ? ChefHat
      : post?.kind === "discovery"
        ? MapPin
        : MessageCircle;
  const linkedRecipe =
    post?.kind === "bake" && post.recipeId
      ? getRecipe(post.recipeId)
      : undefined;
  const hasPhoto = !!recipe || !!post?.images?.length;
  const title =
    recipe?.title ?? (post && post.kind !== "general" ? post.title : undefined);
  return (
    <article
      className={`community-grid-card ${recipe ? "grid-recipe-card" : ""} ${!hasPhoto ? "grid-conversation-card" : ""} ${wide ? "grid-card-wide" : ""}`}
      data-content-kind={recipe ? "recipe" : post!.kind}
      aria-label={title ?? `${author.name}’s conversation`}
    >
      {hasPhoto && (
        <div className="grid-card-media">
          <span className="grid-kind-label">
            <Icon size={14} />
            {label}
          </span>
          {post ? (
            <ImageGallery
              images={post.images ?? []}
              label={
                (post.kind !== "general" ? post.title : undefined) ??
                `${author.name}’s ${label.toLowerCase()}`
              }
            />
          ) : (
            <Link
              className="grid-recipe-photo"
              href={href}
              aria-label={`Open ${recipe!.title}`}
            >
              <img
                src={recipe!.cover.src}
                alt={recipe!.cover.alt}
                width={recipe!.cover.width}
                height={recipe!.cover.height}
                loading="lazy"
              />
            </Link>
          )}
        </div>
      )}
      <div className="grid-card-copy">
        <div className="grid-card-author">
          <Link
            href={profileHref(author.id)}
            aria-label={`View ${author.name}’s profile`}
          >
            <BakerAvatar id={author.id} />
          </Link>
          <div>
            <Link href={profileHref(author.id)}>
              <strong>{author.name}</strong>
            </Link>
            <Link href={href}>
              <small>
                {(post ?? recipe)!.time}
                {!hasPhoto ? ` · ${label}` : ""}
              </small>
            </Link>
          </div>
          {!hasPhoto && <MessageCircle size={18} strokeWidth={1.4} />}
        </div>
        {title && (
          <Link href={href}>
            <h2>{title}</h2>
          </Link>
        )}
        {post ? (
          <Caption
            text={post.caption}
            author={author.name}
            authorId={author.id}
            showAuthor={false}
          />
        ) : (
          <p className="grid-recipe-description">
            {recipe!.description.split(". ")[0]}.
          </p>
        )}
        {post?.kind === "discovery" && post.location && (
          <p className="grid-card-location">
            <MapPin size={12} />
            {post.location}
          </p>
        )}
        {linkedRecipe && (
          <Link
            className="grid-card-recipe-link"
            href={`/recipes/${linkedRecipe.id}`}
          >
            <BookOpen size={13} />
            {linkedRecipe.title}
          </Link>
        )}
        {recipe && (
          <div className="grid-card-recipe-details">
            <span>{recipe.yield}</span>
            <span>Prep {recipe.prep}</span>
          </div>
        )}
        <PostActions target={post ? postTarget(post) : recipeTarget(recipe!)} />
      </div>
    </article>
  );
}
