export const KITCHEN_NOTE_LIMIT = 800;
export const KITCHEN_PHOTO_LIMIT = 1500000;
export interface KitchenNote {
  note: string;
  photo?: string;
  updatedAt: string;
}
export interface KitchenTry extends KitchenNote {
  recipeId: string;
  authorId: string;
}
export type LocalKitchenTries = Record<string, KitchenNote>;

export function readKitchenTries(
  value: unknown,
  recipeIds: readonly string[],
): LocalKitchenTries {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const result: LocalKitchenTries = {};
  for (const recipeId of recipeIds) {
    if (!Object.hasOwn(value, recipeId)) continue;
    const item = (value as Record<string, unknown>)[recipeId];
    if (!item || typeof item !== "object" || Array.isArray(item)) continue;
    const entry = item as Partial<KitchenNote>;
    if (
      typeof entry.note !== "string" ||
      entry.note.length > KITCHEN_NOTE_LIMIT ||
      typeof entry.updatedAt !== "string" ||
      !Number.isFinite(Date.parse(entry.updatedAt))
    )
      continue;
    if (
      entry.photo !== undefined &&
      (typeof entry.photo !== "string" ||
        entry.photo.length > KITCHEN_PHOTO_LIMIT ||
        !/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(
          entry.photo,
        ))
    )
      continue;
    result[recipeId] = {
      note: entry.note.trim(),
      updatedAt: entry.updatedAt,
      ...(entry.photo ? { photo: entry.photo } : {}),
    };
  }
  return result;
}

export function recipeKitchenTries(
  recipeId: string,
  samples: readonly KitchenTry[],
  local: LocalKitchenTries,
  currentBakerId: string,
): KitchenTry[] {
  const unique = new Map<string, KitchenTry>();
  for (const entry of samples) {
    if (entry.recipeId === recipeId && entry.authorId !== currentBakerId)
      unique.set(entry.authorId, entry);
  }
  const own = local[recipeId];
  return own
    ? [{ ...own, recipeId, authorId: currentBakerId }, ...unique.values()]
    : [...unique.values()];
}
