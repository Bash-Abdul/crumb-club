"use client";
import Link from "next/link";
import { bakers, profileHref } from "@/data/bakers";
import { useBakers } from "@/features/profiles/bakers-provider";
import { BakerAvatar } from "@/features/profiles/baker-avatar";
import { useState, type FormEvent } from "react";
import type { Comment } from "./types";
import { useActivity } from "./activity-provider";
export function Comments({ id, initial }: { id: string; initial: Comment[] }) {
  const { comments, addComment, ready, storageError } = useActivity(id);
  const { currentBaker } = useBakers();
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!text.trim()) {
      setMessage("Add a few words before posting.");
      return;
    }
    addComment(id, text);
    setText("");
    setMessage("Your comment has been added.");
  }
  return (
    <section id="comments" className="comments">
      <h2>
        A little conversation <span>({initial.length + comments.length})</span>
      </h2>
      <p>Kind words are always welcome.</p>
      <ul>
        {[...initial, ...comments].map((comment) => {
          const person =
            comment.author === "You"
              ? currentBaker
              : bakers.find((baker) => baker.name === comment.author);
          const name = person?.name ?? comment.author;
          return (
            <li key={comment.id}>
              {person ? (
                <Link
                  className="avatar"
                  href={profileHref(person.id)}
                  aria-label={`View ${name}’s profile`}
                >
                  <BakerAvatar
                    id={person.id}
                    className="baker-avatar-content"
                  />
                </Link>
              ) : (
                <span className="avatar">{comment.initials}</span>
              )}
              <div>
                <strong>
                  {person ? (
                    <Link href={profileHref(person.id)}>{name}</Link>
                  ) : (
                    name
                  )}
                </strong>
                <p>{comment.text}</p>
              </div>
            </li>
          );
        })}
      </ul>
      <form onSubmit={submit}>
        <label htmlFor="comment">Leave a little encouragement</label>
        <textarea
          id="comment"
          value={text}
          onChange={(event) => setText(event.target.value)}
          maxLength={1000}
          rows={3}
          placeholder="That looks lovely…"
          required
        />
        <div>
          <span>{text.length}/1,000</span>
          <button className="button" disabled={!ready || !text.trim()}>
            Post comment
          </button>
        </div>
        <p className="comment-status" role="status">
          {message}
        </p>
        {storageError && (
          <p>
            Browser storage is unavailable. Your comment will last for this
            visit.
          </p>
        )}
      </form>
    </section>
  );
}
