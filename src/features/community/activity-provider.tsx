"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useHydrated } from "@/hooks/use-hydrated";
import type { Activity, PostActivity, Comment } from "./types";
const KEY = "crumb-club:activity:v1";
const empty: PostActivity = { liked: false, saved: false, comments: [] };
interface ActivityContext {
  activity: Activity;
  ready: boolean;
  storageError: boolean;
  toggle: (id: string, key: "liked" | "saved") => void;
  addComment: (id: string, text: string) => void;
}
const Context = createContext<ActivityContext | null>(null);
function readActivity(value: unknown): Activity {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const clean: Activity = {};
  for (const [id, entry] of Object.entries(value)) {
    if (!entry || typeof entry !== "object") continue;
    const item = entry as Partial<PostActivity>;
    if (
      typeof item.liked !== "boolean" ||
      typeof item.saved !== "boolean" ||
      !Array.isArray(item.comments)
    )
      continue;
    clean[id] = {
      liked: item.liked,
      saved: item.saved,
      comments: item.comments.filter(
        (comment: unknown): comment is Comment =>
          !!comment &&
          typeof comment === "object" &&
          ["id", "author", "initials", "text"].every(
            (key) =>
              typeof (comment as Record<string, unknown>)[key] === "string",
          ),
      ),
    };
  }
  return clean;
}
export function ActivityProvider({ children }: { children: ReactNode }) {
  const [activity, setActivity] = useState<Activity>({});
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      if (stored) setActivity(readActivity(JSON.parse(stored)));
    } catch {
      setStorageError(true);
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(activity));
    } catch {
      setStorageError(true);
    }
  }, [activity, ready]);
  function toggle(id: string, key: "liked" | "saved") {
    setActivity((current) => {
      const item = current[id] ?? empty;
      return { ...current, [id]: { ...item, [key]: !item[key] } };
    });
  }
  function addComment(id: string, text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const comment: Comment = {
      id: crypto.randomUUID(),
      author: "You",
      initials: "YO",
      text: trimmed.slice(0, 1000),
    };
    setActivity((current) => {
      const item = current[id] ?? empty;
      return {
        ...current,
        [id]: { ...item, comments: [...item.comments, comment] },
      };
    });
  }
  return (
    <Context.Provider
      value={{ activity, ready, storageError, toggle, addComment }}
    >
      {children}
    </Context.Provider>
  );
}
export function useActivity(id: string) {
  const context = useCommunity();
  return { ...context, ...(context.activity[id] ?? empty) };
}
export function useCommunity() {
  const context = useContext(Context);
  const hydrated = useHydrated();
  if (!context)
    throw new Error("Community components require ActivityProvider");
  return hydrated
    ? context
    : { ...context, activity: {}, ready: false, storageError: false };
}
