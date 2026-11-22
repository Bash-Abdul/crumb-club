"use client";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  ChefHat,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { recipes } from "@/data/content";
import { clubBakers, profileHref } from "@/data/bakers";
import { BakerAvatar } from "@/features/profiles/baker-avatar";
export function DiscoverySidebar() {
  const [member, setMember] = useState(0);
  const members = [0, 1].map(
    (offset) => clubBakers[(member + offset) % clubBakers.length],
  );
  return (
    <aside className="club-home-sidebar" aria-label="Around the club">
      <section className="club-featured-recipe">
        <p>
          <Sparkles size={18} />
          This week’s bake
        </p>
        <Link href="/create?type=bake">
          <img
            src="/images/bread.jpg"
            alt="Flour-dusted golden loaves, fresh from the oven"
            loading="lazy"
          />
          <h2>
            A little loaf.
            <br />
            <em>A little patience.</em>
          </h2>
        </Link>
        <p className="club-featured-description">
          Flour, water, and a slow afternoon. Let’s see what rises.
        </p>
        <Link className="button small" href="/create?type=bake">
          Try the prompt <ChefHat size={15} />
        </Link>
      </section>
      <section className="club-sidebar-recipes">
        <div className="club-sidebar-section-title">
          <h2>
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
              >
                By {recipe.author.name}
              </Link>
            </li>
          ))}
        </ul>
        <Link className="club-sidebar-link" href="/recipes">
          Open the book <ArrowRight size={15} />
        </Link>
      </section>
      <section className="club-meet-members">
        <div>
          <h2>
            <UsersRound size={18} />
            Meet the club
          </h2>
          <button
            type="button"
            onClick={() =>
              setMember((current) => (current + 1) % clubBakers.length)
            }
            aria-label="Meet more bakers"
          >
            <ArrowRight size={17} />
          </button>
        </div>
        <p>A couple of familiar faces. Everyone brings something.</p>
        {members.map((baker) => (
          <Link key={baker.id} href={profileHref(baker.id)}>
            <BakerAvatar id={baker.id} />
            <span>
              <strong>{baker.name}</strong>
              <small>{baker.bio}</small>
            </span>
          </Link>
        ))}
      </section>
    </aside>
  );
}
