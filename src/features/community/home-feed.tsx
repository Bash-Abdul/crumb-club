"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BookOpen,
  Bookmark,
  ChefHat,
  MapPin,
  MessageCircle,
  Wheat,
} from "lucide-react";
import { activeBakeWeek } from "@/data/weekly-bakes";
import type { FeedItem } from "./types";
import {
  feedItems,
  socialPosts,
  recipes,
  resolveFeedItem,
} from "@/data/content";
import { useCommunity } from "./activity-provider";
import { useBakers } from "@/features/profiles/bakers-provider";
import { Mascot } from "@/features/mascots/mascot";
import { HomeComposer } from "./home-composer";
import {
  arrangeHomeGrid,
  readHomeFilter,
  selectHomeFeed,
  type HomeFilter,
} from "./feed-selection";
import { GridCard } from "./grid-card";
import { DiscoverySidebar } from "./discovery-sidebar";
const filters = [
  { value: "all", label: "All", Icon: ChefHat },
  { value: "bakes", label: "Bakes", Icon: ChefHat },
  { value: "recipes", label: "Recipes", Icon: BookOpen },
  { value: "finds", label: "Little finds", Icon: MapPin },
  { value: "conversations", label: "Conversations", Icon: MessageCircle },
] as const;
const catalogue = feedItems;
function key(item: FeedItem) {
  return item.kind === "post"
    ? `post:${item.postId}`
    : `recipe:${item.recipeId}`;
}
export function HomeFeed() {
  const router = useRouter();
  const params = useSearchParams();
  const filter = readHomeFilter(params.get("feed"));
  const { activity, ready, storageError } = useCommunity();
  const { currentBaker, hasProfile } = useBakers();
  const visible = selectHomeFeed(
    catalogue,
    socialPosts,
    recipes,
    filter,
  ).filter(
    (item) => filter !== "saved" || activity[resolveFeedItem(item)!.id]?.saved,
  );
  const grid = arrangeHomeGrid(visible, socialPosts);
  function setFilter(value: HomeFilter) {
    router.replace(value === "all" ? "/app" : `/app?feed=${value}`, {
      scroll: false,
    });
  }
  return (
    <div className="community-home">
      <div className="home-welcome-row">
        <header className="club-home-heading">
          <div>
            <h1 data-tour="home" tabIndex={-1}>
              {hasProfile ? (
                <>
                  Good to see you, <span>{currentBaker.name}.</span>
                </>
              ) : (
                "Good things, shared."
              )}
            </h1>
            <p>Bakes, recipes, discoveries and more from the Crumb Club.</p>
          </div>
          <Mascot className="home-heading-mascot" />
        </header>
        <div className="home-bookmarks">
          <Link
            className="weekly-home-link"
            href={`/weekly/${activeBakeWeek.id}`}
          >
            <ChefHat size={15} /> This week’s bake
          </Link>
          <Link href="/recipes" data-tour="recipe-book">
            <BookOpen size={15} />
            The recipe book
          </Link>
          <Link href="/app?feed=saved" data-tour="saved">
            <Bookmark size={15} />
            Saved favourites
          </Link>
        </div>
      </div>
      {storageError && (
        <p className="storage-notice" role="status">
          Your browser can’t save changes right now. Changes will last for this
          visit.
        </p>
      )}
      {filter !== "saved" ? (
        <div
          className="club-home-filters"
          role="group"
          aria-label="Community content"
          data-tour="filters"
        >
          {filters.map(({ value, label, Icon }) => (
            <button
              key={value}
              type="button"
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
            >
              <Icon size={19} strokeWidth={1.5} />
              {label}
            </button>
          ))}
        </div>
      ) : (
        <div className="club-saved-heading">
          <h2>Saved favourites.</h2>
          <button type="button" onClick={() => setFilter("all")}>
            Back to the community
          </button>
        </div>
      )}
      <div className="community-home-columns">
        <section
          className="community-home-main"
          aria-label={
            filter === "saved" ? "Saved favourites" : "Community contributions"
          }
        >
          {filter !== "saved" && (
            <div data-tour="composer">
              <HomeComposer />
            </div>
          )}
          <p className="sr-only" role="status">
            {filter === "saved" && !ready
              ? "Finding your saved favourites…"
              : `${visible.length} ${visible.length === 1 ? "contribution" : "contributions"}`}
          </p>
          {filter === "saved" && !ready ? (
            <p className="feed-empty" role="status">
              Finding your saved favourites…
            </p>
          ) : visible.length ? (
            <div
              className={`community-grid ${filter !== "all" ? "community-grid-filtered" : ""}`}
            >
              {filter === "all" && grid.feature && grid.find ? (
                <>
                  <div className="community-grid-feature">
                    <GridCard item={grid.feature} />
                  </div>
                  <div className="community-grid-side">
                    <GridCard item={grid.find} />
                    {grid.conversation && <GridCard item={grid.conversation} />}
                  </div>
                  {grid.recipe && <GridCard item={grid.recipe} wide />}
                  {grid.rest.map((item) => (
                    <GridCard
                      key={key(item)}
                      item={item}
                      wide={item.kind === "recipe"}
                    />
                  ))}
                </>
              ) : (
                visible.map((item) => (
                  <GridCard
                    key={key(item)}
                    item={item}
                    wide={item.kind === "recipe"}
                  />
                ))
              )}
            </div>
          ) : (
            <div className="feed-empty">
              <Mascot />
              <h2>
                {filter === "saved"
                  ? "Keep a little inspiration."
                  : "A fresh page for good things."}
              </h2>
              <p>
                {filter === "saved"
                  ? "Save a post or recipe and it’ll be waiting here."
                  : "Nothing in this corner yet. Share something with the club."}
              </p>
              <button className="button" onClick={() => setFilter("all")}>
                Explore all the good things
              </button>
            </div>
          )}
          <p className="feed-end">
            <Wheat size={17} />
            All caught up. Pop the kettle on.
          </p>
        </section>
        <DiscoverySidebar />
      </div>
    </div>
  );
}
