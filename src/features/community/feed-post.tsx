import Link from "next/link";
import { profileHref } from "@/data/bakers";
import { BakerAvatar } from "@/features/profiles/baker-avatar";
import { BookOpen, MapPin } from "lucide-react";
import type { Post, Recipe } from "./types";
import { getRecipe, postLabel, postTarget, recipeTarget } from "@/data/content";
import { ImageGallery } from "./image-gallery";
import { Caption } from "./caption";
import { RecipeLink } from "./recipe-link";
import { PostActions } from "./post-actions";
export function FeedPost({ post }: { post: Post }) {
  const recipe =
    post.kind === "bake" && post.recipeId
      ? getRecipe(post.recipeId)
      : undefined;
  const label = postLabel(post);
  const hasImages = !!post.images?.length;
  return (
    <article
      className={`feed-post social-post ${!hasImages ? "text-only-post" : ""}`}
      aria-label={label}
    >
      <header className="feed-author">
        <Link
          href={profileHref(post.author.id)}
          aria-label={`View ${post.author.name}’s profile`}
          className={`avatar avatar-${post.author.initials.toLowerCase()}`}
        >
          <BakerAvatar id={post.author.id} className="baker-avatar-content" />
        </Link>
        <div>
          <Link href={profileHref(post.author.id)} className="author-name-link">
            <strong>{post.author.name}</strong>
          </Link>
          <span>
            {post.kind !== "general" && (
              <>
                {post.kind === "bake" ? "Shared a bake" : "Little find"}{" "}
                <span aria-hidden="true">·</span>{" "}
              </>
            )}
            <Link href={`/posts/${post.id}`}>{post.time}</Link>
          </span>
        </div>
      </header>
      {hasImages && <ImageGallery images={post.images ?? []} label={label} />}
      <div className="social-post-body">
        {hasImages && <PostActions target={postTarget(post)} />}
        <Caption
          text={post.caption}
          author={post.author.name}
          authorId={post.author.id}
          showAuthor={hasImages}
        />
        {post.kind === "discovery" && post.location && (
          <p className="feed-location">
            <MapPin size={14} />
            {post.location}
          </p>
        )}
        {recipe && <RecipeLink recipe={recipe} />}
        {!hasImages && <PostActions target={postTarget(post)} />}
        {hasImages && (
          <Link
            className="social-conversation"
            href={`/posts/${post.id}#comments`}
          >
            Join the conversation
          </Link>
        )}
      </div>
    </article>
  );
}
export function RecipeActivity({ recipe }: { recipe: Recipe }) {
  return (
    <article
      className="feed-post recipe-activity"
      aria-label={`Recipe: ${recipe.title}`}
    >
      <header className="feed-author">
        <Link
          href={profileHref(recipe.author.id)}
          aria-label={`View ${recipe.author.name}’s profile`}
          className={`avatar avatar-${recipe.author.initials.toLowerCase()}`}
        >
          <BakerAvatar id={recipe.author.id} className="baker-avatar-content" />
        </Link>
        <div>
          <Link
            href={profileHref(recipe.author.id)}
            className="author-name-link"
          >
            <strong>{recipe.author.name}</strong>
          </Link>
          <span>
            Shared a recipe <span aria-hidden="true">·</span>{" "}
            <Link href={`/recipes/${recipe.id}`}>{recipe.time}</Link>
          </span>
        </div>
        <BookOpen size={18} className="recipe-activity-icon" />
      </header>
      <Link
        href={`/recipes/${recipe.id}`}
        className="recipe-activity-photo"
        aria-label={`Open ${recipe.title}`}
      >
        <img
          src={recipe.cover.src}
          alt={recipe.cover.alt}
          width={recipe.cover.width}
          height={recipe.cover.height}
          loading="lazy"
        />
      </Link>
      <div className="recipe-activity-body">
        <p className="eyebrow">A RECIPE TO KEEP</p>
        <Link href={`/recipes/${recipe.id}`}>
          <h2>{recipe.title}</h2>
        </Link>
        <p>{recipe.description.split(". ")[0]}.</p>
        <div className="recipe-activity-meta">
          {recipe.yield && <span>{recipe.yield}</span>}
          {recipe.prep && <span>Prep {recipe.prep}</span>}
        </div>
        <Link href={`/recipes/${recipe.id}`} className="recipe-open">
          View full recipe <BookOpen size={15} />
        </Link>
        <PostActions target={recipeTarget(recipe)} />
      </div>
    </article>
  );
}
