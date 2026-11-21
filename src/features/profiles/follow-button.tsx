"use client";
import { Check, Plus } from "lucide-react";
import { CURRENT_BAKER_ID, bakers } from "@/data/bakers";
import { useBakers } from "./bakers-provider";
export function FollowButton({
  bakerId,
  compact = false,
}: {
  bakerId: string;
  compact?: boolean;
}) {
  const { followingIds, toggleFollow, ready } = useBakers();
  const baker = bakers.find((person) => person.id === bakerId);
  if (bakerId === CURRENT_BAKER_ID || !baker) return null;
  const followed = followingIds.includes(bakerId);
  return (
    <button
      className={`follow-button ${compact ? "compact-follow" : ""} ${followed ? "is-following" : ""}`}
      type="button"
      aria-label={`${followed ? "Unfollow" : "Follow"} ${baker.name}`}
      aria-pressed={followed}
      disabled={!ready}
      onClick={() => toggleFollow(bakerId)}
    >
      {followed ? <Check size={15} /> : <Plus size={15} />}
      <span>{followed ? "Following" : "Follow"}</span>
    </button>
  );
}
