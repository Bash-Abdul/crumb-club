import Link from "next/link";
import { profileHref } from "@/data/bakers";
import { BakerAvatar } from "@/features/profiles/baker-avatar";
import { ChevronLeft } from "lucide-react";
import type { Recipe } from "./types";
import { recipeTarget } from "@/data/content";
import { PostActions } from "./post-actions";
import { RecipeBody } from "./recipe-body";
import { ImageGallery } from "./image-gallery";
import { Comments } from "./comments";
import { AuthorNote } from "./author-note";
export function RecipeDetail({ recipe }: { recipe: Recipe }) {
  return (
    <div className="post-detail standalone-recipe">
      <Link className="back-link" href="/app">
        <ChevronLeft size={17} /> Back to the community
      </Link>
      <div className="detail-heading">
        <p className="eyebrow">FROM THE COMMUNITY RECIPE BOOK</p>
        <h1>{recipe.title}</h1>
        <div className="feed-author">
          <Link
            className="avatar"
            href={profileHref(recipe.author.id)}
            aria-label={`View ${recipe.author.name}’s profile`}
          >
            <BakerAvatar
              id={recipe.author.id}
              className="baker-avatar-content"
            />
          </Link>
          <div>
            <Link
              href={profileHref(recipe.author.id)}
              className="author-name-link"
            >
              <strong>{recipe.author.name}</strong>
            </Link>
            <span>{recipe.time} · Shared a recipe</span>
          </div>
        </div>
      </div>
      <ImageGallery
        detail
        images={[recipe.cover, ...(recipe.additionalImages ?? [])]}
        label={recipe.title}
      />
      <div className="detail-columns">
        <article className="detail-story">
          <PostActions target={recipeTarget(recipe)} />
          <p className="detail-caption">{recipe.description}</p>
          <RecipeBody recipe={recipe} />
          <Comments id={recipe.id} initial={recipe.comments} />
        </article>
        <AuthorNote author={recipe.author} />
      </div>
    </div>
  );
}
