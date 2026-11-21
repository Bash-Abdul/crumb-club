import Link from "next/link";
import { profileHref } from "@/data/bakers";
import { BakerAvatar } from "@/features/profiles/baker-avatar";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock,
  Users,
} from "lucide-react";
import type { Recipe } from "./types";
import { recipes, recipeTarget } from "@/data/content";
import { PostActions } from "./post-actions";
import { RecipeBody } from "./recipe-body";
import { ImageGallery } from "./image-gallery";
import { Comments } from "./comments";

export function RecipeDetail({ recipe }: { recipe: Recipe }) {
  const index = recipes.findIndex((item) => item.id === recipe.id);
  const previous = recipes[index - 1];
  const next = recipes[index + 1];
  const number = String(index + 1).padStart(2, "0");
  return (
    <div className="book-recipe-page">
      <nav className="book-page-nav" aria-label="Recipe book navigation">
        <Link href="/recipes">
          <BookOpen size={16} /> The recipe book
        </Link>
        <span>
          PAGE {number} <span aria-hidden="true">/</span>{" "}
          {String(recipes.length).padStart(2, "0")}
        </span>
        <div>
          {previous && (
            <Link
              href={`/recipes/${previous.id}`}
              aria-label={`Previous recipe: ${previous.title}`}
            >
              <ArrowLeft size={16} />
            </Link>
          )}
          {next && (
            <Link
              href={`/recipes/${next.id}`}
              aria-label={`Next recipe: ${next.title}`}
            >
              <ArrowRight size={16} />
            </Link>
          )}
        </div>
      </nav>
      <article className="book-recipe-paper">
        <header className="book-recipe-intro">
          <div className="book-recipe-title">
            <p className="book-edition">
              {recipe.category} <span>NO. {number}</span>
            </p>
            <h1>{recipe.title}</h1>
            <Link
              className="book-recipe-credit"
              href={profileHref(recipe.author.id)}
            >
              <BakerAvatar id={recipe.author.id} />
              <span>
                Contributed by <strong>{recipe.author.name}</strong>
              </span>
            </Link>
            <p className="book-recipe-description">
              {recipe.description.split(". ").slice(0, 2).join(". ")}
              {recipe.description.split(". ").length > 2 ? "." : ""}
            </p>
            <div className="book-quick-stats">
              {recipe.prep && (
                <span>
                  <Clock size={15} />
                  <span>
                    <small>PREP</small>
                    {recipe.prep}
                  </span>
                </span>
              )}
              {recipe.bake && (
                <span>
                  <span>
                    <small>BAKE</small>
                    {recipe.bake}
                  </span>
                </span>
              )}
              {recipe.yield && (
                <span>
                  <Users size={15} />
                  <span>
                    <small>MAKES</small>
                    {recipe.yield}
                  </span>
                </span>
              )}
            </div>
            <a className="book-jump" href="#recipe">
              Apron on. Let’s begin. <ArrowDown size={15} />
            </a>
          </div>
          <div className="book-recipe-cover">
            <img
              src={recipe.cover.src}
              alt={recipe.cover.alt}
              width={recipe.cover.width}
              height={recipe.cover.height}
              fetchPriority="high"
            />
            <span className="book-page-marker">{number}</span>
          </div>
        </header>
        <div className="book-recipe-reactions">
          <span>One for the recipe book.</span>
          <PostActions target={recipeTarget(recipe)} />
        </div>
        <RecipeBody key={recipe.id} recipe={recipe} />
        <aside className="book-kitchen-note">
          <span className="book-edition">
            A NOTE FROM {recipe.author.name.toUpperCase()}’S KITCHEN
          </span>
          <p>{recipe.description}</p>
          <Link href={profileHref(recipe.author.id)}>
            More from {recipe.author.name} <ArrowRight size={14} />
          </Link>
        </aside>
        {recipe.additionalImages?.length ? (
          <div className="book-extra-photos">
            <h2>A peek at the process.</h2>
            <ImageGallery
              images={recipe.additionalImages}
              label={`${recipe.title}: kitchen photos`}
            />
          </div>
        ) : null}
        <div className="book-table-talk">
          <p className="book-edition">AROUND THE KITCHEN TABLE</p>
          <Comments id={recipe.id} initial={recipe.comments} />
        </div>
        <footer className="book-page-footer">
          <span>
            Crumb Club <span aria-hidden="true">·</span> The community edition
          </span>
          <span>{number}</span>
        </footer>
      </article>
      <Link
        className="book-next-page"
        href={next ? `/recipes/${next.id}` : "/recipes"}
      >
        <span>
          <small>{next ? "TURN THE PAGE" : "BACK TO THE CONTENTS"}</small>
          {next ? next.title : "Find your next favourite."}
        </span>
        <ArrowRight size={22} />
      </Link>
    </div>
  );
}
