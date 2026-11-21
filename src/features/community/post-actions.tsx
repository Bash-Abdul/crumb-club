"use client";
import Link from "next/link";
import { Heart, Bookmark, MessageCircle } from "lucide-react";
import type { ReactionTarget } from "./types";
import { useActivity } from "./activity-provider";
export function PostActions({ target }: { target: ReactionTarget }) {
  const { liked, saved, comments, toggle, ready } = useActivity(target.id);
  return (
    <div className="feed-actions">
      <button
        disabled={!ready}
        aria-label={`Like ${target.label}`}
        aria-pressed={liked}
        onClick={() => toggle(target.id, "liked")}
        className={liked ? "is-selected" : ""}
      >
        <Heart size={20} fill={liked ? "currentColor" : "none"} />
        <span>{target.likes + Number(liked)}</span>
      </button>
      <Link
        href={`${target.href}#comments`}
        aria-label={`Comments on ${target.label}`}
      >
        <MessageCircle size={20} />
        <span>{target.comments.length + comments.length}</span>
      </Link>
      <button
        disabled={!ready}
        aria-label={`Save ${target.label}`}
        aria-pressed={saved}
        className={`feed-save ${saved ? "is-selected" : ""}`}
        onClick={() => toggle(target.id, "saved")}
      >
        <Bookmark size={19} fill={saved ? "currentColor" : "none"} />
        <span>{saved ? "Saved" : "Save"}</span>
      </button>
    </div>
  );
}
