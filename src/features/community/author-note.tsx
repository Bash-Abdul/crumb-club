import Link from "next/link";
import { profileHref } from "@/data/bakers";
import { BakerAvatar } from "@/features/profiles/baker-avatar";
import { Check } from "lucide-react";
import type { Author } from "./types";
export function AuthorNote({ author }: { author: Author }) {
  return (
    <aside className="detail-aside">
      <div className="author-note">
        <Link
          className="avatar"
          href={profileHref(author.id)}
          aria-label={`View ${author.name}’s profile`}
        >
          <BakerAvatar id={author.id} className="baker-avatar-content" />
        </Link>
        <p className="eyebrow">A LITTLE ABOUT THE BAKER</p>
        <h2>
          <Link href={profileHref(author.id)}>{author.name}</Link>
        </h2>
        <p>{author.bio}</p>
        <span>
          <Check size={15} /> Part of the sample community
        </span>
      </div>
      <div className="detail-table-note">
        <h3>Made to be shared.</h3>
        <p>
          Save it for another day, or leave a kind word. The little things make
          this corner feel like home.
        </p>
        <Link className="text-link" href="/app">
          More from the club
        </Link>
      </div>
    </aside>
  );
}
