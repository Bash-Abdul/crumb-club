"use client";
import Link from "next/link";
import { ChefHat, BookOpen, UsersRound } from "lucide-react";
import { recipes } from "@/data/content";
import { popularBakers, profileHref } from "@/data/bakers";
import { FollowButton } from "@/features/profiles/follow-button";
import { BakerAvatar } from "@/features/profiles/baker-avatar";
export function BakingPrompt({ compact = false }: { compact?: boolean }) {
  return (
    <section
      className={compact ? "baking-prompt mobile-prompt" : "baking-prompt"}
      aria-label="This week’s baking prompt"
    >
      <div>
        <p className="eyebrow">THIS WEEK’S BAKE</p>
        <h2>
          A little loaf.
          <br /> A little <em>patience.</em>
        </h2>
        <p>
          Flour, water, and a slow afternoon.
          <br /> Let’s see what rises.
        </p>
        <Link href="/create?type=bake">
          Try the prompt <ChefHat size={15} />
        </Link>
      </div>
      <img
        src="/images/bread.jpg"
        alt="Golden crusty loaves of bread"
        loading="lazy"
      />
    </section>
  );
}
export function DiscoverySidebar() {
  return (
    <aside className="discovery-sidebar">
      <BakingPrompt />
      <section
        className="discovery-section sidebar-recipes"
        aria-labelledby="sidebar-recipe-heading"
      >
        <div className="discovery-section-title">
          <h2 id="sidebar-recipe-heading">
            <Link href="/recipes">From the recipe book</Link>
          </h2>
          <BookOpen size={17} />
        </div>
        <ul className="sidebar-recipe-list">
          {recipes.slice(0, 3).map((recipe) => (
            <li key={recipe.id}>
              <Link
                className="recipe-suggestion"
                href={`/recipes/${recipe.id}`}
              >
                <img
                  src={recipe.cover.src}
                  alt={recipe.cover.alt}
                  loading="lazy"
                />
                <span>
                  <strong>{recipe.title}</strong>
                  <small>{recipe.yield}</small>
                </span>
              </Link>
              <Link
                className="sidebar-recipe-author"
                href={profileHref(recipe.author.id)}
                aria-label={`View ${recipe.author.name}’s profile`}
              >
                By {recipe.author.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section
        className="discovery-section popular-bakers"
        aria-labelledby="popular-bakers-heading"
      >
        <div className="discovery-section-title">
          <h2 id="popular-bakers-heading">Popular bakers</h2>
          <UsersRound size={18} />
        </div>
        <ul className="popular-baker-list">
          {popularBakers.map((baker) => (
            <li key={baker.id}>
              <div className="popular-baker-row">
                <Link
                  href={profileHref(baker.id)}
                  aria-label={`View ${baker.name}’s profile`}
                >
                  <BakerAvatar
                    id={baker.id}
                    className={`avatar avatar-${baker.initials.toLowerCase()}`}
                  />
                  <span>
                    <strong>{baker.name}</strong>
                    <small>
                      {baker.id === "sophie"
                        ? "Cosy bakes & kitchen stories"
                        : baker.id === "amelia"
                          ? "Family recipes & generous sprinkles"
                          : "Bakery finds & weekend wanderings"}
                    </small>
                  </span>
                </Link>
                <FollowButton bakerId={baker.id} compact />
              </div>
            </li>
          ))}
        </ul>
      </section>
      <p className="community-footnote">
        A cosy corner, made for sharing.
        <br />
        Sample stories · demo community
      </p>
    </aside>
  );
}
