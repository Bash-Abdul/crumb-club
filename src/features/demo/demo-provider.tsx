"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useHydrated } from "@/hooks/use-hydrated";
import { bakingCategories } from "@/data/categories";
export const interests = bakingCategories;
export type Interest = (typeof interests)[number];
export type DemoRole = "baker" | "lover" | "both";
export interface DemoPreferences {
  name: string;
  role: DemoRole;
  interests: Interest[];
}
interface DemoContext {
  preferences: DemoPreferences | null;
  ready: boolean;
  storageError: boolean;
  savePreferences: (value: DemoPreferences) => void;
}
const Context = createContext<DemoContext | null>(null);
const KEY = "crumb-club:demo:v1";
function valid(value: unknown): value is DemoPreferences {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<DemoPreferences>;
  return (
    typeof item.name === "string" &&
    item.name.length <= 30 &&
    ["baker", "lover", "both"].includes(item.role ?? "") &&
    Array.isArray(item.interests) &&
    item.interests.every((interest) => interests.includes(interest))
  );
}
export function DemoProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<DemoPreferences | null>(null);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const value: unknown = JSON.parse(raw);
        if (valid(value)) setPreferences(value);
      }
    } catch {
      setStorageError(true);
    }
    setReady(true);
  }, []);
  function savePreferences(value: DemoPreferences) {
    setPreferences(value);
    try {
      localStorage.setItem(KEY, JSON.stringify(value));
    } catch {
      setStorageError(true);
    }
  }
  return (
    <Context.Provider
      value={{ preferences, ready, storageError, savePreferences }}
    >
      {children}
    </Context.Provider>
  );
}
export function useDemo() {
  const value = useContext(Context);
  const hydrated = useHydrated();
  if (!value) throw new Error("DemoProvider is required");
  return hydrated
    ? value
    : { ...value, preferences: null, ready: false, storageError: false };
}
