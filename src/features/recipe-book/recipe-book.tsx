"use client";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  Clock,
  Plus,
  Search,
  Wheat,
} from "lucide-react";
import { recipes } from "@/data/content";
import { profileHref } from "@/data/bakers";
import {
  useActivity,
  useCommunity,
} from "@/features/community/activity-provider";
import type { Recipe } from "@/features/community/types";

const chapters = [
  ...new Set(
    recipes.flatMap((recipe) => (recipe.category ? [recipe.category] : [])),
  ),
];
const contributors = [
  ...new Map(
    recipes.map((recipe) => [recipe.author.id, recipe.author]),
  ).values(),
];
const featured = recipes.find((recipe) => recipe.id === "cinnamon-buns")!;
const pageNumber = (recipe: Recipe) =>
  String(recipes.findIndex((item) => item.id === recipe.id) + 1).padStart(
    2,
    "0",
  );

function RecipeLeaf({ recipe }: { recipe: Recipe }) {
  const { saved, toggle, ready } = useActivity(recipe.id);
  return (
    <article className="book-leaf">
      <Link
        className="book-leaf-photo"
        href={`/recipes/${recipe.id}`}
        aria-label={`Open ${recipe.title}`}
      >
        <img src={recipe.cover.src} alt={recipe.cover.alt} loading="lazy" />
        <span className="book-page-marker">{pageNumber(recipe)}</span>
      </Link>
      <div className="book-leaf-copy">
        <div className="book-leaf-kicker">
          <span>{recipe.category}</span>
          <button
            type="button"
            disabled={!ready}
            aria-label={`Save ${recipe.title}`}
            aria-pressed={saved}
            onClick={() => toggle(recipe.id, "saved")}
          >
            <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
          </button>
        </div>
        <Link href={`/recipes/${recipe.id}`}>
          <h3>{recipe.title}</h3>
        </Link>
        <p>{recipe.description.split(". ")[0]}.</p>
        <div className="book-leaf-footer">
          <Link href={profileHref(recipe.author.id)}>
            From {recipe.author.name}’s kitchen
          </Link>
          <span>
            <Clock size={12} /> {recipe.bake} bake
          </span>
        </div>
      </div>
    </article>
  );
}

export function RecipeBook() {
  const [chapter, setChapter] = useState("All recipes");
  const [query, setQuery] = useState("");
  const { activity, ready, storageError } = useCommunity();
  const savedCount = recipes.filter(
    (recipe) => activity[recipe.id]?.saved,
  ).length;
  const visible = recipes.filter((recipe) => {
    const matchesChapter =
      chapter === "All recipes" ||
      (chapter === "Bookmarked"
        ? activity[recipe.id]?.saved
        : recipe.category === chapter);
    const text =
      `${recipe.title} ${recipe.description} ${recipe.author.name} ${recipe.ingredients.join(" ")}`.toLowerCase();
    return matchesChapter && text.includes(query.trim().toLowerCase());
  });
  return (
    <div className="recipe-book">
      <header className="book-topline">
        <span>
          <BookOpen size={17} /> The Crumb Club kitchen
        </span>
        <Link className="book-add" href="/create?type=recipe">
          <Plus size={16} /> Add a recipe
        </Link>
      </header>
      <section className="book-cover" aria-labelledby="recipe-book-title">
        <div className="book-cover-copy">
          <p className="book-edition">
            THE COMMUNITY EDITION <span>VOL. 01</span>
          </p>
          <Wheat
            className="book-wheat"
            size={35}
            strokeWidth={1.2}
            aria-hidden="true"
          />
          <h1 id="recipe-book-title">
            The recipe
            <br />
            <em>book.</em>
          </h1>
          <p className="book-cover-note">
            A few flour-dusted favourites.
            <br />A little room for yours.
          </p>
          <div className="book-contributors">
            <div aria-label="Contributors">
              {contributors.map((author) => (
                <Link
                  key={author.id}
                  href={profileHref(author.id)}
                  aria-label={`View ${author.name}’s profile`}
                >
                  {author.initials}
                </Link>
              ))}
            </div>
            <span>
              {recipes.length} recipes <span aria-hidden="true">·</span>{" "}
              {contributors.length} kitchens
            </span>
          </div>
        </div>
        <Link href={`/recipes/${featured.id}`} className="book-cover-feature">
          <img
            src={featured.cover.src}
            alt={featured.cover.alt}
            fetchPriority="high"
          />
          <span className="book-ribbon" aria-hidden="true">
            <Bookmark size={17} />
          </span>
          <div>
            <span className="book-feature-eyebrow">
              OPEN AT PAGE {pageNumber(featured)}
            </span>
            <h2>{featured.title}</h2>
            <span className="book-feature-byline">
              By {featured.author.name} <ArrowRight size={18} />
            </span>
          </div>
        </Link>
      </section>
      <section className="book-contents" aria-labelledby="book-contents-title">
        <div className="book-contents-heading">
          <div>
            <p className="book-edition">FIND YOUR NEXT GOOD THING</p>
            <h2 id="book-contents-title">The contents.</h2>
          </div>
          <label className="book-search">
            <Search size={17} />
            <span className="sr-only">Search the recipe book</span>
            <input
              type="search"
              placeholder="A recipe, an ingredient…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </div>
        <div
          className="book-chapters"
          role="group"
          aria-label="Recipe book chapters"
        >
          {["All recipes", ...chapters, "Bookmarked"].map((item) => (
            <button
              type="button"
              key={item}
              aria-pressed={chapter === item}
              onClick={() => setChapter(item)}
            >
              {item}
              {item === "All recipes" && <span>{recipes.length}</span>}
              {item === "Bookmarked" && (
                <>
                  <Bookmark size={13} />
                  <span>{savedCount}</span>
                </>
              )}
            </button>
          ))}
        </div>
        {storageError && (
          <p className="storage-notice" role="status">
            Bookmarks will last for this visit. Your browser can’t save changes
            right now.
          </p>
        )}
        <p className="book-result-count" role="status">
          {chapter === "Bookmarked" && !ready
            ? "Finding your bookmarked recipes…"
            : `${visible.length} ${visible.length === 1 ? "recipe" : "recipes"}${query ? ` for “${query}”` : " on these pages"}`}
        </p>
        {chapter === "Bookmarked" && !ready ? null : visible.length ? (
          <div className="book-leaves">
            {visible.map((recipe) => (
              <RecipeLeaf key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="book-empty">
            <BookOpen size={30} strokeWidth={1.2} />
            <h3>
              {chapter === "Bookmarked" && !query
                ? "Keep a page for later."
                : "No crumbs on this page."}
            </h3>
            <p>
              {chapter === "Bookmarked" && !query
                ? "Bookmark a recipe and you’ll find it here."
                : "Try another ingredient or browse all the recipes."}
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setChapter("All recipes");
              }}
            >
              Browse the book <ArrowRight size={15} />
            </button>
          </div>
        )}
      </section>
      <footer className="book-contribute">
        <div>
          <span className="book-margin-number" aria-hidden="true">
            <Plus size={27} strokeWidth={1.2} />
          </span>
          <div>
            <h2>There’s a page with your name on it.</h2>
            <p>The family favourite. The happy experiment. Write it down.</p>
          </div>
        </div>
        <Link href="/create?type=recipe">
          Add your recipe <ArrowRight size={17} />
        </Link>
      </footer>
      <p className="book-colophon">
        <Wheat size={15} strokeWidth={1.2} /> Collected in good company. Baked
        in your own time.
      </p>
    </div>
  );
}
