"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment } from "react";
import type { FeedItem } from "./types";
import { Wheat } from "lucide-react";
import {
  feedItems,
  socialPosts,
  recipes,
  getPost,
  getRecipe,
  resolveFeedItem,
} from "@/data/content";
import { useCommunity } from "./activity-provider";
import { useDemo } from "@/features/demo/demo-provider";
import { useBakers } from "@/features/profiles/bakers-provider";
import { RecipeBook } from "@/features/recipe-book/recipe-book";
import { Mascot } from "@/features/mascots/mascot";
import { HomeComposer } from "./home-composer";
import { selectHomeFeed } from "./feed-selection";
import { FeedPost, RecipeActivity } from "./feed-post";
import { BakingPrompt, DiscoverySidebar } from "./discovery-sidebar";
const filters = [
  { value: "all", label: "For you" },
  { value: "following", label: "Following" },
] as const;
export function HomeFeed() {
  const router = useRouter();
  const params = useSearchParams();
  const rawFilter = params.get("feed") ?? "all";
  const filter = ["all", "following", "saved", "recipes", "finds"].includes(
    rawFilter,
  )
    ? rawFilter
    : "all";
  const isHome = filter === "all" || filter === "following";
  const collectionTitle =
    filter === "saved"
      ? "Saved"
      : filter === "recipes"
        ? "Recipes"
        : "Little finds";
  const { activity, storageError, ready } = useCommunity();
  const {
    followingIds,
    ready: followsReady,
    storageError: followsStorageError,
    currentBaker,
    hasProfile,
  } = useBakers();
  const { preferences, storageError: preferenceStorageError } = useDemo();
  const candidates: FeedItem[] =
    filter === "saved"
      ? [
          ...socialPosts.map((post): FeedItem => ({
            kind: "post",
            postId: post.id,
          })),
          ...recipes.map((recipe): FeedItem => ({
            kind: "recipe",
            recipeId: recipe.id,
          })),
        ]
      : feedItems;
  const visible = selectHomeFeed(
    candidates,
    socialPosts,
    recipes,
    filter === "following",
    followingIds,
  ).filter((item) => {
    const resource = resolveFeedItem(item);
    if (!resource) return false;
    if (filter === "saved") return activity[resource.id]?.saved;
    if (filter === "recipes") return item.kind === "recipe";
    if (filter === "finds")
      return item.kind === "post" && getPost(item.postId)?.kind === "discovery";
    return true;
  });
  function setFilter(value: string) {
    router.replace(value === "all" ? "/app" : `/app?feed=${value}`, {
      scroll: false,
    });
  }
  if (filter === "recipes") return <RecipeBook />;
  return (
    <>
      <h1 className="mobile-home-title">
        <span>Your community feed</span>
        <Mascot className="mobile-feed-companion" />
      </h1>
      <header className="community-heading">
        <div>
          <h1>
            {hasProfile
              ? `Good to see you, ${currentBaker.name}.`
              : "Good things, shared."}
          </h1>
          <p>What’s baking today?</p>
        </div>
        <Link href="/join" className="demo-entry">
          {preferences ? "Your interests" : "Make yourself at home"}
        </Link>
      </header>
      {(storageError || preferenceStorageError || followsStorageError) && (
        <p className="storage-notice" role="status">
          Your browser can’t save changes right now. Changes will last for this
          visit.
        </p>
      )}
      <div className="home-columns">
        <section className="feed-column" aria-label="Community feed">
          {isHome ? (
            <div
              className="feed-tabs home-tabs"
              role="group"
              aria-label="Home feed"
            >
              {filters.map((item) => (
                <button
                  key={item.value}
                  aria-pressed={filter === item.value}
                  onClick={() => setFilter(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ) : (
            <header className="collection-heading">
              <h2>{collectionTitle}</h2>
              <Link href="/app">Back to Home</Link>
            </header>
          )}
          {filter === "all" && <HomeComposer />}
          <div className="feed-list">
            {(filter === "saved" && !ready) ||
            (filter === "following" && !followsReady) ? (
              <p className="feed-empty" role="status">
                {filter === "following"
                  ? "Finding your bakers’ posts…"
                  : "Finding your saved bakes…"}
              </p>
            ) : visible.length ? (
              visible.map((item, index) => {
                const post =
                  item.kind === "post" ? getPost(item.postId) : undefined;
                const recipe =
                  item.kind === "recipe" ? getRecipe(item.recipeId) : undefined;
                return (
                  <Fragment key={`${item.kind}-${post?.id ?? recipe?.id}`}>
                    {post ? (
                      <FeedPost post={post} />
                    ) : recipe ? (
                      <RecipeActivity recipe={recipe} />
                    ) : null}
                    {index === 2 && filter === "all" && (
                      <BakingPrompt compact />
                    )}
                  </Fragment>
                );
              })
            ) : (
              <div className="feed-empty">
                <Mascot />
                <h2>
                  {filter === "following"
                    ? "A little quiet here."
                    : "Keep a little inspiration."}
                </h2>
                <p>
                  {filter === "following"
                    ? "Posts from the bakers you follow will appear here. Explore For you to meet the community."
                    : "Tap Save on a post or recipe and it’ll be waiting here for you."}
                </p>
                <button className="button" onClick={() => setFilter("all")}>
                  Back to the good things
                </button>
              </div>
            )}
          </div>
          <p className="feed-end">
            <Wheat size={18} /> All caught up. Pop the kettle on.
          </p>
        </section>
        <DiscoverySidebar />
      </div>
    </>
  );
}
