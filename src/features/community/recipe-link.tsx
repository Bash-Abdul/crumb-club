import Link from "next/link";
import { BookOpen } from "lucide-react";
import type { Recipe } from "./types";
export function RecipeLink({ recipe }: { recipe: Recipe }) {
  return (
    <Link className="social-recipe-link" href={`/recipes/${recipe.id}`}>
      <img src={recipe.cover.src} alt="" loading="lazy" />
      <span>
        <small>
          <BookOpen size={12} /> Recipe behind this bake
        </small>
        <strong>{recipe.title}</strong>
        <span>View recipe</span>
      </span>
    </Link>
  );
}
