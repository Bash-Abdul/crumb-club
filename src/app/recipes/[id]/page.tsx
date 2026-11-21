import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { recipes, getRecipe } from "@/data/content";
import { AppShell } from "@/components/app-shell";
import { RecipeDetail } from "@/features/community/recipe-detail";
export function generateStaticParams() {
  return recipes.map((recipe) => ({ id: recipe.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const recipe = getRecipe(id);
  return {
    title: recipe
      ? `${recipe.title} — Crumb Club`
      : "Recipe not found — Crumb Club",
    description: recipe?.description,
  };
}
export default async function RecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipe = getRecipe(id);
  if (!recipe) notFound();
  return (
    <AppShell>
      <RecipeDetail recipe={recipe} />
    </AppShell>
  );
}
