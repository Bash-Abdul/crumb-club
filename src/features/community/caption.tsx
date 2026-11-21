"use client";
import { useId, useState } from "react";
import Link from "next/link";
import { profileHref } from "@/data/bakers";
export function Caption({
  text,
  author,
  authorId,
  showAuthor = true,
}: {
  text?: string;
  author: string;
  authorId?: string;
  showAuthor?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  if (!text) return null;
  const long = text.length > 140;
  const boundary = text.lastIndexOf(" ", 140);
  const preview = long
    ? text.slice(0, boundary > 0 ? boundary : 140) + "…"
    : text;
  return (
    <div className="social-caption">
      <p id={id}>
        {showAuthor && (
          <>
            <strong>
              {authorId ? (
                <Link className="author-name-link" href={profileHref(authorId)}>
                  {author}
                </Link>
              ) : (
                author
              )}
            </strong>{" "}
          </>
        )}{" "}
        {expanded ? text : preview}
      </p>
      {long && (
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={id}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}
