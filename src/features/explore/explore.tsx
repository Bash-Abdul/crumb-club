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
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
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
import {
  matchesExploreCategory,
  selectExternalDiscoveries,
  communityTopics,
} from "./discovery-selection";
import { bakingCategories } from "@/data/categories";
import { externalDiscoveries } from "@/data/external-discoveries";
import { ExternalDiscoveries } from "./external-discoveries";
import { BakerAvatar } from "@/features/profiles/baker-avatar";
import { useBakerTries } from "@/features/recipe-book/kitchen-provider";
import { CURRENT_BAKER_ID } from "@/data/bakers";
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
    raw.toLowerCase() === "recipes"
      ? "Recipes"
      : raw.toLowerCase() === "bakeries"
        ? "Bakeries"
        : (bakingCategories.find(
            (value) => value.toLowerCase() === raw.toLowerCase(),
          ) ?? raw);
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
      !matchesExploreCategory(resource, category) ||
      (bakerId && resource.author.id !== bakerId)
    )
      return false;
    const tags = "tags" in resource ? (resource.tags ?? []) : [];
    const bakedCategory =
      "category" in resource ? (resource.category ?? "") : "";
    const text =
      `${post.title} ${post.story} ${post.author} ${bakedCategory} ${tags.join(" ")} ${(communityTopics[resource.id] ?? []).join(" ")}`.toLowerCase();
    return text.includes(query.toLowerCase().trim());
  });
  const matchingBakers = query.trim()
    ? bakers.filter((person) =>
        `${person.name} ${person.handle} ${person.bio}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
      )
    : [];
  const outside = selectExternalDiscoveries(
    externalDiscoveries,
    category,
    query,
    bakerId,
  );
  const ownTries = useBakerTries(CURRENT_BAKER_ID).filter((entry) => {
    const recipe = getRecipe(entry.recipeId);
    return (
      !bakerId &&
      recipe &&
      matchesExploreCategory(recipe, category) &&
      `${recipe.title} ${entry.note}`
        .toLowerCase()
        .includes(query.trim().toLowerCase())
    );
  });
  const selectedPeople = query.trim()
    ? matchingBakers
    : !category && !bakerId
      ? bakers.slice(0, 3)
      : [];
  const externalFind = externalDiscoveries.find(
    (item) => item.type === "bakery",
  )!;
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
            aria-expanded={value === "More" ? more : undefined}
            aria-controls={
              value === "More" ? "explore-more-categories" : undefined
            }
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
          id="explore-more-categories"
          role="group"
          aria-label="More categories"
        >
          {[
            ...bakingCategories.filter(
              (value) => !categories.some((item) => item.value === value),
            ),
            "Recipes",
            "Bakeries",
          ].map((value) => (
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
      {matchingBakers.length > 0 && !bakerId && (
        <section
          className="explore-baker-results"
          aria-label="Bakers matching your search"
        >
          <h2>Bakers</h2>
          <div>
            {matchingBakers.map((person) => (
              <Link key={person.id} href={profileHref(person.id)}>
                <BakerAvatar id={person.id} />
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
                ? `${baker.name}’s contributions${category ? ` · ${category}` : ""}`
                : category ||
                  (bakerId
                    ? "Baker’s contributions"
                    : query.trim()
                      ? "From the community"
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
          ) : outside.length ||
            ownTries.length ||
            (!bakerId && matchingBakers.length) ? (
            <p className="explore-section-empty" role="status">
              No community contributions match just yet.{" "}
              {outside.length
                ? "There’s something from the wider baking world below."
                : "Try another craving, or clear the filters to browse."}
            </p>
          ) : (
            <div className="discovery-empty" role="status">
              <Mascot />
              <h2>Not a crumb here just yet.</h2>
              <p>
                Our little collection is still growing. Try another craving or
                browse all the discoveries.
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
            <div className="explore-community-note">
              <MessageCircle size={22} />
              <div>
                <p className="outside-label">A MOMENT FROM THE CLUB</p>
                <Link href="/posts/kitchen-sunshine">
                  <h3>A little sunshine on the kitchen counter.</h3>
                  <p>{getPost("kitchen-sunshine")?.caption}</p>
                </Link>
                <Link
                  className="explore-note-author"
                  href={profileHref("noor")}
                >
                  From Noor’s kitchen <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </section>
          <ExternalDiscoveries
            items={externalDiscoveries.filter((item) => item.type !== "bakery")}
          />
          <section className="explore-bakery">
            <div className="explore-section-title">
              <h2>A very good little find</h2>
              <Link
                className="explore-find-all"
                href="/explore?category=Bakeries"
              >
                More little finds <ArrowRight size={14} />
              </Link>
            </div>
            <Link href="/posts/little-bakery" className="explore-bakery-card">
              <img
                src="/images/bakery.jpg"
                alt="Fresh bread displayed in a cosy neighbourhood bakery"
                loading="lazy"
              />
              <span>
                <small>
                  <MapPin size={14} /> A FIND FROM THE COMMUNITY
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
            <a
              href={externalFind.url}
              target="_blank"
              rel="noopener noreferrer"
              className="explore-external-find"
            >
              <span className="outside-label">CURATED · BEYOND THE CLUB</span>
              <div>
                <h3>{externalFind.title}</h3>
                <p>{externalFind.description}</p>
                <span>{externalFind.source} · Opens in a new tab</span>
              </div>
              <ArrowUpRight size={23} />
            </a>
          </section>
        </>
      )}
      {filtered && <ExternalDiscoveries items={outside} filtered />}
      {filtered && ownTries.length > 0 && (
        <section className="explore-your-tries">
          <div className="explore-section-title">
            <h2>From your kitchen</h2>
            <span>Your recipe adventures</span>
          </div>
          {ownTries.map((entry) => (
            <Link
              key={entry.recipeId}
              href={`/recipes/${entry.recipeId}#other-kitchens`}
            >
              <CheckCircle2 size={21} />
              <span>
                <strong>You tried {getRecipe(entry.recipeId)?.title}</strong>
                <small>
                  {entry.note || "A good thing from the shared recipe book."}
                </small>
              </span>
              <ArrowRight size={17} />
            </Link>
          ))}
        </section>
      )}
      {!filtered && selectedPeople.length > 0 && (
        <section className="explore-meet">
          <div>
            <p className="outside-label">THERE’S A PERSON BEHIND EVERY BAKE</p>
            <h2>Meet the club.</h2>
            <p>A few people to share this little corner with.</p>
          </div>
          <div>
            {selectedPeople.map((person) => (
              <Link key={person.id} href={profileHref(person.id)}>
                <BakerAvatar id={person.id} />
                <span>
                  <strong>{person.name}</strong>
                  <small>{person.bio}</small>
                </span>
                <ArrowRight size={15} />
              </Link>
            ))}
          </div>
        </section>
      )}
      <p className="explore-demo-note">
        Sample community contributions · external discoveries selected by Crumb
        Club
      </p>
    </div>
  );
}
