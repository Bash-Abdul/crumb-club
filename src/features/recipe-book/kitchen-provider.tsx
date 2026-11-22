"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { recipes } from "@/data/content";
import { CURRENT_BAKER_ID } from "@/data/bakers";
import { sampleKitchenTries } from "@/data/kitchen-tries";
import { useHydrated } from "@/hooks/use-hydrated";
import {
  readKitchenTries,
  recipeKitchenTries,
  type LocalKitchenTries,
  type KitchenNote,
} from "./kitchen-tries";
const KEY = "crumb-club:kitchen-tries:v1";
const recipeIds = recipes.map((recipe) => recipe.id);
interface KitchenContext {
  local: LocalKitchenTries;
  ready: boolean;
  storageError: boolean;
  saveTry: (recipeId: string, note: string, photo?: string) => boolean;
  removeTry: (recipeId: string) => void;
}
const Context = createContext<KitchenContext | null>(null);
export function KitchenProvider({ children }: { children: ReactNode }) {
  const [local, setLocal] = useState<LocalKitchenTries>({});
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        let stored: unknown;
        try {
          stored = JSON.parse(raw);
        } catch {
          stored = null;
        }
        setLocal(readKitchenTries(stored, recipeIds));
      }
    } catch {
      setStorageError(true);
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(local));
    } catch {
      setStorageError(true);
    }
  }, [local, ready]);
  function saveTry(recipeId: string, note: string, photo?: string) {
    if (!ready || !recipeIds.includes(recipeId)) return false;
    const clean = readKitchenTries(
      {
        [recipeId]: {
          note,
          ...(photo ? { photo } : {}),
          updatedAt: new Date().toISOString(),
        },
      },
      recipeIds,
    )[recipeId];
    if (!clean) return false;
    setLocal((current) => ({ ...current, [recipeId]: clean }));
    return true;
  }
  function removeTry(recipeId: string) {
    if (!ready) return;
    setLocal((current) => {
      const next = { ...current };
      delete next[recipeId];
      return next;
    });
  }
  return (
    <Context.Provider
      value={{ local, ready, storageError, saveTry, removeTry }}
    >
      {children}
    </Context.Provider>
  );
}
export function useKitchen(recipeId: string) {
  const context = useContext(Context);
  const hydrated = useHydrated();
  if (!context) throw new Error("Kitchen components require KitchenProvider");
  const local = hydrated ? context.local : {};
  return {
    ...context,
    ready: hydrated && context.ready,
    storageError: hydrated && context.storageError,
    local,
    own: local[recipeId] as KitchenNote | undefined,
    tries: recipeKitchenTries(
      recipeId,
      sampleKitchenTries,
      local,
      CURRENT_BAKER_ID,
    ),
  };
}

export function useBakerTries(bakerId: string) {
  const context = useContext(Context);
  const hydrated = useHydrated();
  if (!context) throw new Error("KitchenProvider is required");
  const local = hydrated ? context.local : {};
  return recipeIds
    .flatMap((recipeId) =>
      recipeKitchenTries(recipeId, sampleKitchenTries, local, CURRENT_BAKER_ID),
    )
    .filter((entry) => entry.authorId === bakerId);
}
