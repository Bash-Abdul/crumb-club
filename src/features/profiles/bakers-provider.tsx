"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  bakers,
  CURRENT_BAKER_ID,
  mockRelationships,
  type Baker,
} from "@/data/bakers";
import { useHydrated } from "@/hooks/use-hydrated";
import { followedAuthorIds } from "@/data/content";
import { useDemo } from "@/features/demo/demo-provider";
import {
  normaliseFollowing,
  toggleFollowing,
  relationshipCounts,
  type FollowRelationship,
} from "./relationships";
const FOLLOW_KEY = "crumb-club:following:v1";
const PROFILE_KEY = "crumb-club:profile:v1";
export interface ProfileChanges {
  name: string;
  bio: string;
  avatar?: string;
}
interface BakerContext {
  currentBaker: Baker;
  hasProfile: boolean;
  followingIds: string[];
  ready: boolean;
  storageError: boolean;
  toggleFollow: (id: string) => void;
  saveProfile: (value: ProfileChanges) => void;
  getCounts: (id: string) => { followers: number; following: number };
}
const Context = createContext<BakerContext | null>(null);
const knownIds = bakers.map((baker) => baker.id);
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
export function BakersProvider({ children }: { children: ReactNode }) {
  const { preferences, ready: demoReady } = useDemo();
  const [followingIds, setFollowingIds] = useState<string[]>([
    ...followedAuthorIds,
  ]);
  const [overrides, setOverrides] = useState<ProfileChanges | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(FOLLOW_KEY);
      if (raw) {
        const value: unknown = JSON.parse(raw);
        if (
          value &&
          typeof value === "object" &&
          "followingIds" in value &&
          Array.isArray(value.followingIds)
        )
          setFollowingIds(
            normaliseFollowing(value.followingIds, CURRENT_BAKER_ID, knownIds),
          );
      }
    } catch {
      setStorageError(true);
    }
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (raw) setOverrides(readProfile(JSON.parse(raw)));
    } catch {
      setStorageError(true);
    }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(FOLLOW_KEY, JSON.stringify({ followingIds }));
    } catch {
      setStorageError(true);
    }
  }, [followingIds, loaded]);
  const currentBaker: Baker = {
    id: CURRENT_BAKER_ID,
    name: overrides?.name || preferences?.name || "Crumb friend",
    handle: "you",
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
        : "Keep your favourites together and make the club feel like you."),
    avatar: overrides?.avatar,
  };
  function toggleFollow(id: string) {
    if (!loaded) return;
    setFollowingIds((current) =>
      toggleFollowing(current, id, CURRENT_BAKER_ID, knownIds),
    );
  }
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
  function getCounts(id: string) {
    const relationships: FollowRelationship[] = [
      ...mockRelationships,
      ...followingIds.map((followingId) => ({
        followerId: CURRENT_BAKER_ID,
        followingId,
      })),
    ];
    return relationshipCounts(id, relationships);
  }
  return (
    <Context.Provider
      value={{
        currentBaker,
        hasProfile: !!overrides || !!preferences,
        followingIds,
        ready: loaded && demoReady,
        storageError,
        toggleFollow,
        saveProfile,
        getCounts,
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
  if (hydrated) return value;
  return {
    ...value,
    currentBaker: {
      id: CURRENT_BAKER_ID,
      name: "Crumb friend",
      handle: "you",
      initials: "YO",
      bio: "Keep your favourites together and make the club feel like you.",
    },
    hasProfile: false,
    followingIds: [...followedAuthorIds],
    ready: false,
    storageError: false,
    getCounts: (id: string) =>
      relationshipCounts(id, [
        ...mockRelationships,
        ...followedAuthorIds.map((followingId) => ({
          followerId: CURRENT_BAKER_ID,
          followingId,
        })),
      ]),
  };
}
