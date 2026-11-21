"use client";
import Link from "next/link";
import { Heart, Bookmark } from "lucide-react";
import type { CommunityPost } from "@/data/posts";
import { useActivity } from "@/features/community/activity-provider";
export function PostCard({ post }: { post: CommunityPost }) {
  const { liked, saved, toggle, ready } = useActivity(post.id);
  return (
    <article className="post">
      <div className="post-photo">
        <Link href={`/posts/${post.id}`} aria-label={`Read ${post.title}`}>
          <img src={post.image} alt={post.alt} loading="lazy" />
        </Link>
        <button
          disabled={!ready}
          className={`save ${saved ? "active" : ""}`}
          aria-label={`Save ${post.title}`}
          aria-pressed={saved}
          onClick={() => toggle(post.id, "saved")}
        >
          <Bookmark size={19} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="post-content">
        <p className="eyebrow">{post.category}</p>
        <Link href={`/posts/${post.id}`}>
          <h3>{post.title}</h3>
        </Link>
        <p className="post-story">{post.story}</p>
        <div className="post-meta">
          <span className="avatar">{post.initials}</span>
          <span>{post.author}</span>
          <button
            disabled={!ready}
            className={liked ? "like active" : "like"}
            aria-label={`Like ${post.title}`}
            aria-pressed={liked}
            onClick={() => toggle(post.id, "liked")}
          >
            <Heart size={17} fill={liked ? "currentColor" : "none"} />
            {post.likes + Number(liked)}
          </button>
        </div>
      </div>
    </article>
  );
}
