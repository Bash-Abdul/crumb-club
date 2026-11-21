import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { RecipeBook } from "@/features/recipe-book/recipe-book";

export const metadata: Metadata = {
  title: "The recipe book — Crumb Club",
  description: "Flour-dusted favourites from the Crumb Club community.",
};

export default function RecipesPage() {
  return (
    <AppShell>
      <RecipeBook />
    </AppShell>
  );
}
