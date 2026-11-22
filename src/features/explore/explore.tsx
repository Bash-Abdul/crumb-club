"use client";
import { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CakeSlice,
  Cookie,
  Croissant,
  Wheat,
  Cake,
  Grid2X2,
  Bookmark,
  MapPin,
  MessageCircle,
} from "lucide-react";
import {
  allContentPreviews as posts,
  contentHref,
  type CommunityPost,
} from "@/data/posts";
import { useActivity } from "@/features/community/activity-provider";
import { getPost, getRecipe } from "@/data/content";
import { bakers, profileHref } from "@/data/bakers";
import { Mascot } from "@/features/mascots/mascot";
import { matchesCategory } from "@/features/community/classification";
const categories = [
  { value: "Cakes", Icon: CakeSlice },
  { value: "Cookies", Icon: Cookie },
  { value: "Pastries", Icon: Croissant },
  { value: "Bread", Icon: Wheat },
  { value: "Cupcakes", Icon: Cake },
  { value: "More", Icon: Grid2X2 },
];
function DiscoveryTile({ post }: { post: CommunityPost }) {
  const { saved, toggle, ready } = useActivity(post.id);
  const resource = getPost(post.id);
  const isRecipe = !!getRecipe(post.id);
  return (
    <article className="discovery-tile">
      <Link href={contentHref(post)} className="discovery-tile-image">
        {post.image ? (
          <img src={post.image} alt={post.alt} loading="lazy" />
        ) : (
          <span className="discovery-text-preview">
            <MessageCircle size={25} />
            <span>{post.story.slice(0, 120)}</span>
          </span>
        )}
      </Link>
      <div>
        <Link href={contentHref(post)}>
          <h3>
            {post.id === "sunday-buns"
              ? "Sunday cinnamon buns"
              : post.id === "lemon-cake"
                ? "Mum’s vanilla cupcakes"
                : post.title}
          </h3>
        </Link>
        <button
          disabled={!ready}
          aria-label={`Save ${post.title}`}
          aria-pressed={saved}
          onClick={() => toggle(post.id, "saved")}
        >
          <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
        </button>
        <p>
          <Link
            href={profileHref(
              resource?.author.id ?? getRecipe(post.id)?.author.id ?? "",
            )}
            className="author-name-link"
          >
            {post.author}
          </Link>{" "}
          ·{" "}
          {isRecipe
            ? "Recipe"
            : resource?.kind === "bake"
              ? "Home baked"
              : resource?.kind === "discovery"
                ? "Little find"
                : "Post"}
        </p>
      </div>
    </article>
  );
}
export function Explore() {
  const params = useSearchParams();
  const router = useRouter();
  const query = params.get("q") ?? "";
  const [more, setMore] = useState(false);
  const bakerId = params.get("baker") ?? "";
  const baker = bakers.find((person) => person.id === bakerId);
  const raw = params.get("category") ?? "";
  const category =
    raw === "recipes" ? "Recipes" : raw === "bakeries" ? "Bakeries" : raw;
  function select(value: string) {
    const next = new URLSearchParams();
    if (value) next.set("category", value);
    if (bakerId) next.set("baker", bakerId);
    if (query.trim()) next.set("q", query.trim());
    router.replace(next.size ? `/explore?${next.toString()}` : "/explore", {
      scroll: false,
    });
  }
  const visible = posts.filter((post) => {
    const resource = getPost(post.id) ?? getRecipe(post.id);
    if (
      !resource ||
      !matchesCategory(resource, category) ||
      (bakerId && resource.author.id !== bakerId)
    )
      return false;
    const tags = "tags" in resource ? (resource.tags ?? []) : [];
    const bakedCategory =
      "category" in resource ? (resource.category ?? "") : "";
    const text =
      `${post.title} ${post.story} ${post.author} ${bakedCategory} ${tags.join(" ")}`.toLowerCase();
    return text.includes(query.toLowerCase().trim());
  });
  const matchingBakers = query.trim()
    ? bakers.filter((person) =>
        `${person.name} ${person.handle} ${person.bio}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
      )
    : [];
  const filtered = !!category || !!query.trim() || !!bakerId;
  return (
    <div className="explore-page">
      <header className="explore-heading">
        <p className="eyebrow">A LITTLE INSPIRATION</p>
        <h1>
          Follow your <em>cravings.</em>
        </h1>
        <p>Something to bake. Somewhere to try.</p>
      </header>
      <div
        className="explore-categories"
        role="group"
        aria-label="Browse by category"
      >
        {categories.map(({ value, Icon }) => (
          <button
            key={value}
            aria-pressed={value === "More" ? more : category === value}
            onClick={() =>
              value === "More"
                ? setMore(!more)
                : select(category === value ? "" : value)
            }
          >
            <Icon size={29} strokeWidth={1.45} />
            <span>{value}</span>
          </button>
        ))}
      </div>
      {more && (
        <div
          className="more-categories"
          role="group"
          aria-label="More categories"
        >
          {["Brownies", "Pancakes", "Recipes", "Bakeries"].map((value) => (
            <button
              key={value}
              aria-pressed={category === value}
              onClick={() => select(category === value ? "" : value)}
            >
              {value}
            </button>
          ))}
        </div>
      )}
      {matchingBakers.length > 0 && (
        <section
          className="explore-baker-results"
          aria-label="Bakers matching your search"
        >
          <h2>Bakers</h2>
          <div>
            {matchingBakers.map((person) => (
              <Link key={person.id} href={profileHref(person.id)}>
                <span className="avatar">{person.initials}</span>
                <span>
                  <strong>{person.name}</strong>
                  <small>@{person.handle}</small>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
      {filtered ? (
        <section className="explore-results">
          <div className="explore-section-title">
            <h2>
              {baker
                ? `${baker.name}’s posts${category ? ` · ${category}` : ""}`
                : category ||
                  (bakerId
                    ? "Baker’s posts"
                    : query.trim()
                      ? "Posts & recipes"
                      : "Search results")}{" "}
              <span>({visible.length})</span>
            </h2>
            <button
              onClick={() => {
                router.replace("/explore", { scroll: false });
              }}
            >
              Clear filters
            </button>
          </div>
          {visible.length ? (
            <div className="discovery-grid">
              {visible.map((post) => (
                <DiscoveryTile key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="discovery-empty" role="status">
              <Mascot />
              <h2>Not a crumb here just yet.</h2>
              <p>
                Our demo has a small recipe box. Try pastries, cupcakes or
                bread.
              </p>
              <button
                className="button"
                onClick={() => {
                  router.replace("/explore", { scroll: false });
                }}
              >
                Explore all the good things
              </button>
            </div>
          )}
        </section>
      ) : (
        <>
          <section>
            <div className="explore-section-title">
              <h2>Fresh from the community</h2>
              <span>Made with a little love</span>
            </div>
            <div className="discovery-grid">
              {posts
                .filter((post) =>
                  ["sunday-buns", "lemon-cake"].includes(post.id),
                )
                .map((post) => (
                  <DiscoveryTile key={post.id} post={post} />
                ))}
            </div>
          </section>
          <section className="explore-bakery">
            <div className="explore-section-title">
              <h2>A very good little find</h2>
              <button onClick={() => select("Bakeries")}>See the story</button>
            </div>
            <Link href="/posts/little-bakery" className="explore-bakery-card">
              <img
                src="/images/bakery.jpg"
                alt="Fresh bread displayed in a cosy neighbourhood bakery"
                loading="lazy"
              />
              <span>
                <small>
                  <MapPin size={14} /> A NEIGHBOURHOOD FIND
                </small>
                <h3>
                  The long way home,
                  <br />
                  for a warm loaf.
                </h3>
                <p>
                  James’s new Saturday ritual. One little bakery, a very good
                  discovery.
                </p>
                <span className="small-text-link">Read James’s story</span>
              </span>
            </Link>
          </section>
        </>
      )}
      <p className="explore-demo-note">
        A taste of the club · sample community content
      </p>
    </div>
  );
}
