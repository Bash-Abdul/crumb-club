"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bookmark,
  BookOpen,
  CheckCircle2,
  Grid2X2,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import { useDemo } from "./demo-provider";
import { useCommunity } from "@/features/community/activity-provider";
import {
  allContentPreviews as previews,
  contentHref,
  type CommunityPost,
} from "@/data/posts";
import { bakers, CURRENT_BAKER_ID, getPublishedItems } from "@/data/bakers";
import { getPost, getRecipe, resolveFeedItem } from "@/data/content";
import { useBakers } from "@/features/profiles/bakers-provider";
import { BakerAvatar } from "@/features/profiles/baker-avatar";
import { useBakerTries } from "@/features/recipe-book/kitchen-provider";
import { ReplayTour } from "@/features/tour/replay-tour";
import { ProfileMascot } from "@/features/mascots/profile-mascot";
import { Mascot } from "@/features/mascots/mascot";
import { ProfileEditor } from "@/features/profiles/profile-editor";
type ProfileTab = "posts" | "recipes" | "tried" | "saved";
function ContentList({ items }: { items: CommunityPost[] }) {
  return (
    <ul className="corner-content-list">
      {items.map((item) => (
        <li key={item.id}>
          <Link href={contentHref(item)}>
            {item.image ? (
              <img src={item.image} alt="" loading="lazy" />
            ) : (
              <span className="corner-text-thumb">
                <Grid2X2 size={24} />
              </span>
            )}
            <span>
              <strong>{item.title}</strong>
              <small>{item.author}</small>
            </span>
            <ArrowRight size={17} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
export function DemoProfile({
  bakerId = CURRENT_BAKER_ID,
}: {
  bakerId?: string;
}) {
  const { preferences } = useDemo();
  const { activity } = useCommunity();
  const { currentBaker, ready, storageError } = useBakers();
  const [editing, setEditing] = useState(false);
  const [options, setOptions] = useState(false);
  const [tab, setTab] = useState<ProfileTab>("posts");
  const [message, setMessage] = useState("");
  const editButton = useRef<HTMLButtonElement>(null);
  const own = bakerId === CURRENT_BAKER_ID;
  const baker = own
    ? currentBaker
    : bakers.find((person) => person.id === bakerId);
  const saved = previews.filter((post) => activity[post.id]?.saved);
  const published = getPublishedItems(bakerId);
  const tries = useBakerTries(bakerId);
  const recipeItems = published.filter((item) => item.kind === "recipe");
  const postItems = published.filter((item) => item.kind === "post");
  const bakesShared = postItems.filter(
    (item) => getPost(item.postId)?.kind === "bake",
  ).length;
  const items =
    tab === "saved"
      ? saved
      : tab === "tried"
        ? tries.flatMap((entry) => {
            const preview = previews.find((p) => p.id === entry.recipeId);
            return preview ? [preview] : [];
          })
        : (tab === "recipes" ? recipeItems : postItems).flatMap((item) => {
            const id = item.kind === "recipe" ? item.recipeId : item.postId;
            const preview = previews.find((p) => p.id === id);
            return preview ? [preview] : [];
          });
  if (!ready)
    return (
      <p role="status" className="app-loading">
        Finding your little corner…
      </p>
    );
  if (!baker) return null;
  const interests = own
    ? (preferences?.interests ?? [])
    : [
        ...new Set(
          published.flatMap((item) => {
            const resource = resolveFeedItem(item);
            return resource && "category" in resource && resource.category
              ? [resource.category]
              : [];
          }),
        ),
      ];
  function closeEditor() {
    setEditing(false);
    requestAnimationFrame(() => editButton.current?.focus());
  }
  const tabs = [
    {
      id: "posts" as const,
      label: "Posts",
      count: postItems.length,
      Icon: Grid2X2,
    },
    {
      id: "recipes" as const,
      label: "Recipes",
      count: recipeItems.length,
      Icon: BookOpen,
    },
    {
      id: "tried" as const,
      label: "Tried",
      count: tries.length,
      Icon: CheckCircle2,
    },
    ...(own
      ? [
          {
            id: "saved" as const,
            label: "Saved",
            count: saved.length,
            Icon: Bookmark,
          },
        ]
      : []),
  ];
  return (
    <div className="profile-corner">
      <div className="corner-cover">
        <img
          src="/images/buns-proofing.jpg"
          alt="Cinnamon dough resting in a warm kitchen"
          fetchPriority="high"
        />
      </div>
      <header className="corner-intro">
        <BakerAvatar id={baker.id} className="corner-avatar" />
        <div className="corner-identity">
          <h1>{baker.name}</h1>
          <p className="corner-handle">@{baker.handle}</p>
          <p>{baker.bio || "Baking, tasting, and a bit of both."}</p>
        </div>
        {own && (
          <div className="corner-actions">
            <button
              className="button"
              ref={editButton}
              aria-expanded={editing}
              onClick={() => {
                setEditing(!editing);
                setMessage("");
              }}
            >
              Edit Profile
            </button>
            <div className="corner-options">
              <button
                className="corner-more"
                aria-label="Profile options"
                aria-expanded={options}
                aria-controls="corner-options"
                onClick={() => setOptions(!options)}
              >
                <MoreHorizontal size={22} />
              </button>
              {options && (
                <div id="corner-options">
                  <ReplayTour />
                  <Link href="/join">Edit interests & companion</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
      {own && editing && (
        <ProfileEditor
          baker={baker}
          onClose={closeEditor}
          onSaved={() => {
            closeEditor();
            setMessage("Profile updated.");
          }}
        />
      )}
      {message && <p role="status">{message}</p>}
      {storageError && (
        <p role="status">
          Changes will last for this visit. Browser storage is unavailable.
        </p>
      )}
      <section
        className="corner-summary"
        aria-label="Contributions and companion"
      >
        <dl className="corner-counts">
          <div>
            <dt>Recipes shared</dt>
            <dd>{recipeItems.length}</dd>
          </div>
          <div>
            <dt>Bakes shared</dt>
            <dd>{bakesShared}</dd>
          </div>
          <div>
            <dt>Recipes tried</dt>
            <dd>{tries.length}</dd>
          </div>
        </dl>
        {own && <ProfileMascot />}
      </section>
      <section className="corner-interests">
        <h2>{own ? "Your" : "Their"} kind of good things</h2>
        <div>
          {interests.map((interest) => (
            <Link
              key={interest}
              href={`/explore?category=${encodeURIComponent(interest)}`}
            >
              {interest}
            </Link>
          ))}
          {own && (
            <Link className="corner-edit-interests" href="/join">
              <Plus size={16} />{" "}
              {interests.length ? "Edit interests" : "Choose your interests"}
            </Link>
          )}
        </div>
      </section>
      <nav className="corner-tabs" aria-label="Profile content">
        {tabs.map(({ id, label, count, Icon }) => (
          <button
            key={id}
            aria-current={tab === id ? "page" : undefined}
            onClick={() => setTab(id)}
            aria-controls="corner-content"
          >
            <Icon size={19} />
            {label} ({count})
          </button>
        ))}
      </nav>
      <div className={`corner-columns${own ? "" : " corner-columns--public"}`}>
        <section
          id="corner-content"
          aria-label={`${tabs.find((item) => item.id === tab)?.label} by ${baker.name}`}
        >
          {items.length ? (
            <ContentList items={items} />
          ) : (
            <div className="corner-empty">
              <Mascot />
              <h2>
                {tab === "posts"
                  ? own
                    ? "Your first little story is still to come."
                    : "A little story is still to come."
                  : tab === "recipes"
                    ? "A fresh page, waiting for a recipe."
                    : tab === "tried"
                      ? "Every recipe starts with a first try."
                      : "Keep a little for later."}
              </h2>
              <p>
                {tab === "posts"
                  ? "Share a bake, a find, a kitchen moment, or anything else you’d like to add to the club."
                  : tab === "saved"
                    ? "Save a recipe or a story you love. You’ll find it here."
                    : "Find a little inspiration in the club’s shared recipe book."}
              </p>
              {own && (
                <Link
                  className="button"
                  href={
                    tab === "posts"
                      ? "/create?type=post"
                      : tab === "recipes"
                        ? "/create?type=recipe"
                        : "/recipes"
                  }
                >
                  <Plus size={18} />
                  {tab === "posts"
                    ? "Create a post"
                    : tab === "recipes"
                      ? "Share a recipe"
                      : "Open the recipe book"}
                </Link>
              )}
            </div>
          )}
        </section>
        {own && (
          <aside className="corner-aside">
            <section>
              <div className="corner-section-heading">
                <h2>Recently saved</h2>
                <button onClick={() => setTab("saved")}>
                  View all <ArrowRight size={16} />
                </button>
              </div>
              {saved.length ? (
                <ContentList items={saved.slice(0, 2)} />
              ) : (
                <p className="corner-quiet">
                  A place for the good things you want to come back to.{" "}
                  <Link href="/explore">Find something lovely.</Link>
                </p>
              )}
            </section>
            <section>
              <h2>Recent activity</h2>
              {tries.length ? (
                <ul className="corner-activity">
                  {[...tries]
                    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
                    .slice(0, 3)
                    .map((entry) => (
                      <li key={entry.recipeId}>
                        <CheckCircle2 size={19} />
                        <Link href={`/recipes/${entry.recipeId}`}>
                          Tried{" "}
                          <strong>{getRecipe(entry.recipeId)?.title}</strong>
                        </Link>
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="corner-quiet">
                  Your recipe adventures will appear here. A first attempt
                  counts, too.
                </p>
              )}
            </section>
          </aside>
        )}
      </div>
    </div>
  );
}
