"use client";
import { useState, type FormEvent } from "react";
import type { Baker } from "@/data/bakers";
import { useBakers } from "./bakers-provider";
export function ProfileEditor({
  baker,
  onClose,
  onSaved,
}: {
  baker: Baker;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { saveProfile } = useBakers();
  const [name, setName] = useState(baker.name);
  const [bio, setBio] = useState(baker.bio);
  const [avatar, setAvatar] = useState<string | undefined>(baker.avatar);
  const [error, setError] = useState("");
  const [reading, setReading] = useState(false);
  function photo(file: File | undefined) {
    if (!file) return;
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 1024 * 1024
    ) {
      setError("Choose a JPG, PNG or WebP photograph up to 1 MB.");
      return;
    }
    setError("");
    setReading(true);
    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(String(reader.result));
      setReading(false);
    };
    reader.onerror = () => {
      setError("That photograph couldn’t be opened. Try another one.");
      setReading(false);
    };
    reader.readAsDataURL(file);
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || reading) return;
    saveProfile({ name: name.trim(), bio: bio.trim(), avatar });
    onSaved();
  }
  return (
    <form
      className="profile-editor"
      onSubmit={submit}
      aria-label="Edit Profile"
    >
      <div className="profile-editor-heading">
        <h2>A little more you.</h2>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </div>
      <label htmlFor="profile-name">
        Display name
        <input
          autoFocus
          id="profile-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          maxLength={50}
        />
      </label>
      <label htmlFor="profile-bio">
        Bio <span>(optional)</span>
        <textarea
          id="profile-bio"
          value={bio}
          onChange={(event) => setBio(event.target.value)}
          rows={3}
          maxLength={240}
        />
      </label>
      <div className="profile-editor-photo">
        <span className="profile-avatar">
          {avatar ? (
            <img src={avatar} alt="Your chosen avatar" />
          ) : (
            name.slice(0, 2).toUpperCase()
          )}
        </span>
        <div>
          <label htmlFor="profile-photo">
            Avatar <span>(optional)</span>
            <input
              id="profile-photo"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => photo(event.target.files?.[0])}
            />
          </label>
          <small>JPG, PNG or WebP · up to 1 MB · saved locally</small>
          {avatar && (
            <button type="button" onClick={() => setAvatar(undefined)}>
              Remove photo
            </button>
          )}
        </div>
      </div>
      <p className="profile-editor-error" role="alert">
        {error}
      </p>
      <button className="button" disabled={!name.trim() || reading}>
        {reading ? "Opening photo…" : "Save profile"}
      </button>
    </form>
  );
}
