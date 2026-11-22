import { getBakeWeek } from "@/data/weekly-bakes";
import Link from "next/link";
import { profileHref } from "@/data/bakers";
import { BakerAvatar } from "@/features/profiles/baker-avatar";
import { ChevronLeft, MapPin } from "lucide-react";
import type { Post } from "./types";
import { getRecipe, postLabel, postTarget } from "@/data/content";
import { PostActions } from "./post-actions";
import { ImageGallery } from "./image-gallery";
import { Comments } from "./comments";
import { RecipeLink } from "./recipe-link";
import { AuthorNote } from "./author-note";
export function PostDetail({ post }: { post: Post }) {
  const recipe =
    post.kind === "bake" && post.recipeId
      ? getRecipe(post.recipeId)
      : undefined;
  return (
    <div className="post-detail social-detail">
      <Link className="back-link" href="/app">
        <ChevronLeft size={17} /> Back to the community
      </Link>
      {post.kind === "bake" && post.weekId && getBakeWeek(post.weekId) && (
        <Link className="weekly-entry-tag" href={`/weekly/${post.weekId}`}>
          Part of {getBakeWeek(post.weekId)?.title}
        </Link>
      )}
      <div className="detail-heading">
        <p className="eyebrow">
          {post.kind === "bake"
            ? "SHARED A BAKE"
            : post.kind === "discovery"
              ? "LITTLE FIND"
              : "FROM THE COMMUNITY"}
        </p>
        <h1>{postLabel(post)}</h1>
        <div className="feed-author">
          <Link
            className="avatar"
            href={profileHref(post.author.id)}
            aria-label={`View ${post.author.name}’s profile`}
          >
            <BakerAvatar id={post.author.id} className="baker-avatar-content" />
          </Link>
          <div>
            <Link
              href={profileHref(post.author.id)}
              className="author-name-link"
            >
              <strong>{post.author.name}</strong>
            </Link>
            <span>
              {post.time} ·{" "}
              {post.kind === "bake"
                ? "From a home kitchen"
                : post.kind === "discovery"
                  ? "A little discovery"
                  : "A moment from the community"}
            </span>
          </div>
        </div>
      </div>
      {!!post.images?.length && (
        <ImageGallery detail images={post.images} label={postLabel(post)} />
      )}
      <div className="detail-columns">
        <article className="detail-story">
          <PostActions target={postTarget(post)} />
          {post.caption && <p className="detail-caption">{post.caption}</p>}
          {post.kind === "discovery" && post.location && (
            <p className="feed-location">
              <MapPin size={16} />
              {post.location}
            </p>
          )}
          {recipe && <RecipeLink recipe={recipe} />}
          <Comments id={post.id} initial={post.comments} />
        </article>
        <AuthorNote author={post.author} />
      </div>
    </div>
  );
}
