"use client";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChefHat,
  Clock,
  Plus,
} from "lucide-react";
import { bakeWeeks, activeWeekId, type BakeWeek } from "@/data/weekly-bakes";
import { GridCard } from "@/features/community/grid-card";
import { socialPosts, getRecipe } from "@/data/content";
import { useKitchen } from "@/features/recipe-book/kitchen-provider";
import { BakerAvatar } from "@/features/profiles/baker-avatar";
import { profileHref, bakers, CURRENT_BAKER_ID } from "@/data/bakers";
import { useBakers } from "@/features/profiles/bakers-provider";
import { Mascot } from "@/features/mascots/mascot";
import { RecipeKitchens } from "@/features/recipe-book/recipe-kitchens";
export function WeeklyPage({ week }: { week: BakeWeek }) {
  const active = week.id === activeWeekId;
  const recipe =
    week.format === "recipe" ? getRecipe(week.recipeId) : undefined;
  const { tries } = useKitchen(recipe?.id ?? "");
  const { currentBaker } = useBakers();
  const themePosts = socialPosts.filter(
    (post) => post.kind === "bake" && post.weekId === week.id,
  );
  const entries = tries.filter((entry) => entry.weekIds?.includes(week.id));
  const kitchenCount = new Set([
    ...entries.map((entry) => entry.authorId),
    ...themePosts.map((post) => post.author.id),
  ]).size;
  return (
    <div className="weekly-page">
      <Link className="weekly-back" href="/app">
        <ArrowLeft size={16} /> Around the club
      </Link>
      <header className={`weekly-hero weekly-hero--${week.format}`}>
        <div className="weekly-hero-copy">
          <p className="weekly-kicker">
            <ChefHat size={16} />
            {active ? "THIS WEEK’S BAKE" : "FROM WEEKS PAST"}
          </p>
          <p className="weekly-date">
            {week.dates} ·{" "}
            {week.format === "theme" ? "An open theme" : "A recipe, together"}
          </p>
          <h1>{week.title}</h1>
          <p className="weekly-introduction">{week.introduction}</p>
          <div className="weekly-hero-actions">
            {active ? (
              <Link
                className="button"
                href={
                  recipe
                    ? `/recipes/${recipe.id}?week=${week.id}#other-kitchens`
                    : `/create?type=bake&week=${week.id}`
                }
              >
                <Plus size={17} />
                {recipe ? "Try this recipe" : "Share your bake"}
              </Link>
            ) : (
              <span className="weekly-closed">
                <Clock size={15} /> A week to look back on
              </span>
            )}
            <a href="#club-kitchens">
              See the kitchens <ArrowRight size={16} />
            </a>
          </div>
          <p className="weekly-small-note">
            No perfect bakes required. A little curiosity will do.
          </p>
        </div>
        <div className="weekly-hero-photo">
          <img src={week.image} alt={week.alt} fetchPriority="high" />
          <span>
            {week.format === "theme"
              ? "YOUR KITCHEN. YOUR TAKE."
              : "SAME RECIPE. YOUR OWN LITTLE TWIST."}
          </span>
        </div>
      </header>
      {recipe ? (
        <section className="weekly-recipe">
          <div>
            <p className="weekly-kicker">THE RECIPE AT THE HEART OF IT</p>
            <h2>{recipe.title}</h2>
            <p>From {recipe.author.name}’s kitchen, passed around the club.</p>
            <div className="weekly-recipe-meta">
              <span>
                <Clock size={15} />
                {recipe.prep}
              </span>
              <span>
                <ChefHat size={15} />
                {recipe.yield}
              </span>
            </div>
            <Link
              className="button"
              href={`/recipes/${recipe.id}${active ? `?week=${week.id}` : ""}`}
            >
              <BookOpen size={16} /> Open the recipe
            </Link>
          </div>
          <img src={recipe.cover.src} alt={recipe.cover.alt} />
        </section>
      ) : (
        <section className="weekly-theme-note">
          <span className="weekly-handwritten">Make it your own.</span>
          <div>
            <h2>A theme, not a rulebook.</h2>
            <p>
              Sweet or savoury. A family recipe or a first attempt. If apples
              have found their way into your bake, there’s a place for it here.
            </p>
          </div>
          <BookOpen size={28} />
          <Link href="/recipes">
            Looking for a starting point?
            <br />
            <strong>
              Wander through the recipe book <ArrowRight size={15} />
            </strong>
          </Link>
        </section>
      )}
      <section id="club-kitchens" className="weekly-kitchens">
        <div className="weekly-section-heading">
          <div>
            <p className="weekly-kicker">GOOD THINGS HAPPEN IN COMPANY</p>
            <h2>From the club’s kitchens.</h2>
          </div>
          <span>
            {kitchenCount} {kitchenCount === 1 ? "kitchen" : "kitchens"}
          </span>
        </div>
        {active && recipe ? (
          <RecipeKitchens recipeId={recipe.id} weekId={week.id} />
        ) : themePosts.length ? (
          <div className="weekly-theme-posts">
            {themePosts.map((post) => (
              <GridCard
                key={post.id}
                item={{ kind: "post", postId: post.id }}
              />
            ))}
          </div>
        ) : entries.length ? (
          <div className="weekly-attempts">
            {entries.map((entry) => {
              const author =
                entry.authorId === CURRENT_BAKER_ID
                  ? currentBaker
                  : bakers.find((b) => b.id === entry.authorId);
              return (
                <article key={entry.authorId}>
                  <Link
                    href={profileHref(entry.authorId)}
                    className="weekly-baker"
                  >
                    <BakerAvatar id={entry.authorId} />
                    <span>
                      <strong>{author?.name ?? "A club baker"}</strong>
                      <small>A little note from their kitchen</small>
                    </span>
                  </Link>
                  {entry.photo && (
                    <img
                      className="weekly-attempt-photo"
                      src={entry.photo}
                      alt={`${author?.name ?? "A baker"}’s recipe attempt`}
                      loading="lazy"
                    />
                  )}
                  <p>
                    {entry.note ||
                      "Gave this recipe a go. Another good thing from the book."}
                  </p>
                  <Link
                    className="weekly-attempt-link"
                    href={`/recipes/${entry.recipeId}#other-kitchens`}
                  >
                    See the recipe & kitchen notes <ArrowRight size={14} />
                  </Link>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="weekly-empty">
            <Mascot />
            <div>
              <h3>
                {active
                  ? "A little space for the first bake."
                  : "A quiet page in the club’s scrapbook."}
              </h3>
              <p>
                {active
                  ? "The golden tops, the wonky edges, the things you’d try differently. There’s room for all of it."
                  : "No contributions were recorded for this edition."}
              </p>
              {active && (
                <Link
                  href={
                    recipe
                      ? `/recipes/${recipe.id}?week=${week.id}#other-kitchens`
                      : `/create?type=bake&week=${week.id}`
                  }
                >
                  {recipe ? "Tell us how yours went" : "Start your bake"}{" "}
                  <ArrowRight size={15} />
                </Link>
              )}
            </div>
          </div>
        )}
        {active && !recipe && (
          <p className="weekly-prototype-note">
            For now, sharing opens a draft saved on this device. Community
            publishing is still to come.
          </p>
        )}
      </section>
      <section className="weekly-archive">
        <div className="weekly-section-heading">
          <div>
            <p className="weekly-kicker">A FEW GOOD WEEKS</p>
            <h2>Pages from the club.</h2>
          </div>
        </div>
        {bakeWeeks
          .filter((item) => item.id !== week.id)
          .map((item) => (
            <Link
              className="weekly-archive-link"
              key={item.id}
              href={`/weekly/${item.id}`}
            >
              <img src={item.image} alt="" loading="lazy" />
              <div>
                <small>
                  {item.id === activeWeekId ? "This week" : item.dates} ·{" "}
                  {item.format === "theme" ? "Open theme" : "Featured recipe"}
                </small>
                <h3>{item.title}</h3>
              </div>
              <ArrowRight size={23} />
            </Link>
          ))}
      </section>
    </div>
  );
}
