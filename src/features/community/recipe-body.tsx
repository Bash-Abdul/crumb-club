"use client";
import { useState } from "react";
import { Clock, Users, BookOpen } from "lucide-react";
import type { Recipe } from "./types";
export function RecipeBody({ recipe }: { recipe: Recipe }) {
  const [checked, setChecked] = useState<string[]>([]);
  return (
    <section id="recipe" className="recipe-detail">
      <p className="eyebrow">
        <BookOpen size={15} /> THE RECIPE
      </p>
      <div className="recipe-stats">
        {recipe.prep && (
          <span>
            <Clock size={16} /> Prep {recipe.prep}
          </span>
        )}
        {recipe.bake && <span>Bake {recipe.bake}</span>}
        {recipe.yield && (
          <span>
            <Users size={16} />
            {recipe.yield}
          </span>
        )}
      </div>
      <div className="book-method-columns">
        <div className="book-ingredients">
          <h2>What you’ll need</h2>
          <p className="recipe-help">Tap an ingredient as you go.</p>
          <ul className="ingredient-list">
            {recipe.ingredients.map((ingredient) => (
              <li key={ingredient}>
                <label>
                  <input
                    type="checkbox"
                    checked={checked.includes(ingredient)}
                    onChange={() =>
                      setChecked((current) =>
                        current.includes(ingredient)
                          ? current.filter((item) => item !== ingredient)
                          : [...current, ingredient],
                      )
                    }
                  />
                  <span>{ingredient}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div className="book-method">
          <h2>Let’s make it.</h2>
          <ol className="recipe-steps">
            {recipe.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
      {recipe.note && <p className="recipe-help">{recipe.note}</p>}
    </section>
  );
}
