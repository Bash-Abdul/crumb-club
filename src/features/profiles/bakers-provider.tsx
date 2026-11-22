"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { CURRENT_BAKER_ID, type Baker } from "@/data/bakers";
import { useHydrated } from "@/hooks/use-hydrated";
import { useDemo } from "@/features/demo/demo-provider";
const PROFILE_KEY = "crumb-club:profile:v1";
export interface ProfileChanges {
  name: string;
  bio: string;
  avatar?: string;
}
interface BakerContext {
  currentBaker: Baker;
  hasProfile: boolean;
  ready: boolean;
  storageError: boolean;
  saveProfile: (value: ProfileChanges) => void;
}
const Context = createContext<BakerContext | null>(null);
function readProfile(value: unknown): ProfileChanges | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Partial<ProfileChanges>;
  if (
    typeof item.name !== "string" ||
    !item.name.trim() ||
    item.name.length > 50 ||
    typeof item.bio !== "string" ||
    item.bio.length > 240
  )
    return null;
  if (
    item.avatar !== undefined &&
    (typeof item.avatar !== "string" ||
      item.avatar.length > 1500000 ||
      !/^data:image\/(jpeg|png|webp);base64,/.test(item.avatar))
  )
    return null;
  return { name: item.name.trim(), bio: item.bio, avatar: item.avatar };
}
const guest: Baker = {
  id: CURRENT_BAKER_ID,
  name: "Crumb friend",
  handle: "you",
  initials: "YO",
  bio: "Keep your favourites together and make the club feel like you.",
};
export function BakersProvider({ children }: { children: ReactNode }) {
  const { preferences, ready: demoReady } = useDemo();
  const [overrides, setOverrides] = useState<ProfileChanges | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (raw) setOverrides(readProfile(JSON.parse(raw)));
    } catch {
      setStorageError(true);
    }
    setLoaded(true);
  }, []);
  const name = overrides?.name || preferences?.name || guest.name;
  const currentBaker: Baker = {
    ...guest,
    name,
    initials:
      (overrides?.name || preferences?.name)?.slice(0, 2).toUpperCase() || "YO",
    bio:
      overrides?.bio ??
      (preferences
        ? preferences.role === "baker"
          ? "A little flour, a lot of love."
          : preferences.role === "lover"
            ? "Always room for something lovely."
            : "Baking, tasting, and a bit of both."
        : guest.bio),
    avatar: overrides?.avatar,
  };
  function saveProfile(value: ProfileChanges) {
    const clean = readProfile(value);
    if (!clean) return;
    setOverrides(clean);
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(clean));
    } catch {
      setStorageError(true);
    }
  }
  return (
    <Context.Provider
      value={{
        currentBaker,
        hasProfile: !!overrides || !!preferences,
        ready: loaded && demoReady,
        storageError,
        saveProfile,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useBakers() {
  const value = useContext(Context);
  const hydrated = useHydrated();
  if (!value) throw new Error("BakersProvider is required");
  return hydrated
    ? value
    : {
        ...value,
        currentBaker: guest,
        hasProfile: false,
        ready: false,
        storageError: false,
      };
}
