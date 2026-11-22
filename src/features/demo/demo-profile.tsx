"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { Bookmark, ChefHat } from "lucide-react";
import { useDemo } from "./demo-provider";
import { useCommunity } from "@/features/community/activity-provider";
import { allContentPreviews as posts, contentHref } from "@/data/posts";
import { bakers, CURRENT_BAKER_ID, getPublishedItems } from "@/data/bakers";
import { getPost, resolveFeedItem } from "@/data/content";
import { useBakers } from "@/features/profiles/bakers-provider";
import { BakerAvatar } from "@/features/profiles/baker-avatar";
import { FollowButton } from "@/features/profiles/follow-button";
import { ProfileMascot } from "@/features/mascots/profile-mascot";
import { Mascot } from "@/features/mascots/mascot";
import { ProfileEditor } from "@/features/profiles/profile-editor";
export function DemoProfile({
  bakerId = CURRENT_BAKER_ID,
}: {
  bakerId?: string;
}) {
  const { preferences } = useDemo();
  const { activity } = useCommunity();
  const { currentBaker, ready, storageError, getCounts } = useBakers();
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const editButton = useRef<HTMLButtonElement>(null);
  const own = bakerId === CURRENT_BAKER_ID;
  const baker = own
    ? currentBaker
    : bakers.find((person) => person.id === bakerId);
  const saved = posts.filter((post) => activity[post.id]?.saved);
  const published = getPublishedItems(bakerId);
  const counts = getCounts(bakerId);
  if (!ready)
    return (
      <p role="status" className="app-loading">
        Finding your little corner…
      </p>
    );
  if (!baker) return null;
  const interests = own
    ? (preferences?.interests ?? [])
    : [
        ...new Set(
          published
            .map((item) => {
              const resource = resolveFeedItem(item);
              return resource && "category" in resource
                ? resource.category
                : undefined;
            })
            .filter(
              (category): category is NonNullable<typeof category> =>
                !!category,
            ),
        ),
      ];
  function closeEditor() {
    setEditing(false);
    requestAnimationFrame(() => editButton.current?.focus());
  }
  return (
    <div className="demo-profile-page">
      <header className="profile-intro">
        <BakerAvatar id={baker.id} className="profile-avatar" />
        <p className="eyebrow">
          {own
            ? "YOUR LITTLE CORNER · DEMO PROFILE"
            : "BAKER PROFILE · DEMO COMMUNITY"}
        </p>
        <h1>
          {own && !preferences && baker.name === "Crumb friend"
            ? "A place at the table."
            : baker.name}
        </h1>
        <p className="profile-handle">@{baker.handle}</p>
        {baker.bio && <p>{baker.bio}</p>}
        <dl className="profile-counts">
          <div>
            <dt>Followers</dt>
            <dd data-profile-followers>{counts.followers}</dd>
          </div>
          <div>
            <dt>Following</dt>
            <dd data-profile-following>{counts.following}</dd>
          </div>
          <div>
            <dt>Published</dt>
            <dd data-profile-published>{published.length}</dd>
          </div>
        </dl>
        <div className="profile-header-actions">
          {own ? (
            <>
              <button
                className="button"
                ref={editButton}
                onClick={() => {
                  setEditing(!editing);
                  setMessage("");
                }}
                aria-expanded={editing}
              >
                Edit Profile
              </button>
              <Link className="profile-interests-link" href="/join">
                {preferences ? "Edit your interests" : "Enter demo mode"}
              </Link>
            </>
          ) : (
            <FollowButton bakerId={baker.id} />
          )}
        </div>
      </header>
      {own && editing && (
        <ProfileEditor
          baker={baker}
          onClose={closeEditor}
          onSaved={() => {
            closeEditor();
            setMessage("Profile updated.");
          }}
        />
      )}
      {own && message && (
        <p className="profile-feedback" role="status">
          {storageError
            ? "Profile updated for this visit. Browser storage is unavailable."
            : message}
        </p>
      )}
      {storageError && (
        <p className="profile-storage-notice" role="status">
          Changes will last for this visit. Your browser can’t save them right
          now.
        </p>
      )}
      {own && <ProfileMascot />}
      {interests.length > 0 && (
        <section className="profile-interests">
          <h2>
            {own ? "Your kind of good things" : "Their kind of good things"}
          </h2>
          <div>
            {interests.map((interest) => (
              <Link
                key={interest}
                href={`/explore?category=${encodeURIComponent(interest)}`}
              >
                {interest}
              </Link>
            ))}
          </div>
        </section>
      )}
      <section
        className="profile-saved profile-published"
        aria-labelledby="published-heading"
      >
        <div className="explore-section-title">
          <h2 id="published-heading">Shared with the club</h2>
          <ChefHat size={19} />
        </div>
        {published.length ? (
          <ul>
            {published.map((item) => {
              const id = item.kind === "post" ? item.postId : item.recipeId;
              const preview = posts.find((post) => post.id === id);
              if (!preview) return null;
              const kind =
                item.kind === "recipe"
                  ? "Recipe"
                  : getPost(id)?.kind === "general"
                    ? "Post"
                    : getPost(id)?.kind === "bake"
                      ? "Bake"
                      : "Little find";
              return (
                <li key={`${item.kind}-${id}`}>
                  <Link href={contentHref(preview)}>
                    {preview.image ? (
                      <img src={preview.image} alt="" />
                    ) : (
                      <span className="saved-text-thumbnail" aria-hidden="true">
                        {preview.initials}
                      </span>
                    )}
                    <span>
                      <strong>{preview.title}</strong>
                      <small>
                        {kind} · {resolveFeedItem(item)?.time}
                      </small>
                      <span className="profile-post-excerpt">
                        {preview.story}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="profile-empty">
            <Mascot />
            <p>
              {own
                ? "Your first little story is still to come."
                : "Nothing shared just yet."}
            </p>
            {own && (
              <Link className="small-text-link" href="/create?type=post">
                Start a demo draft
              </Link>
            )}
          </div>
        )}
      </section>
      {own && (
        <section
          className="profile-saved"
          aria-labelledby="private-saved-heading"
        >
          <div className="explore-section-title">
            <h2 id="private-saved-heading">Tucked away for later</h2>
            <Bookmark size={19} />
          </div>
          <p className="private-saved-note">
            Only you can see your saved content.{" "}
            <Link href="/app?feed=saved">Open Saved</Link>
          </p>
          {saved.length ? (
            <ul>
              {saved.map((post) => (
                <li key={post.id}>
                  <Link href={contentHref(post)}>
                    {post.image ? (
                      <img src={post.image} alt="" />
                    ) : (
                      <span className="saved-text-thumbnail" aria-hidden="true">
                        {post.initials}
                      </span>
                    )}
                    <span>
                      <strong>{post.title}</strong>
                      <small>{post.author}</small>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="profile-empty">
              <Mascot />
              <p>
                Your next favourite is out there.
                <br />
                Save a post and it’ll be waiting here.
              </p>
              <Link href="/explore" className="small-text-link">
                Find a little inspiration
              </Link>
            </div>
          )}
        </section>
      )}
      <p className="profile-scope">
        {own
          ? "Your profile and follows are saved on this device. Public publishing, collections and a baking journal are still to come."
          : "Sample community profile · follow changes stay in this browser."}
      </p>
    </div>
  );
}
