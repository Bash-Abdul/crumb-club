"use client";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  ArrowDown,
  Camera,
  Check,
  ChefHat,
  Pencil,
  Plus,
  X,
} from "lucide-react";
import { bakers, CURRENT_BAKER_ID, profileHref } from "@/data/bakers";
import { BakerAvatar } from "@/features/profiles/baker-avatar";
import { useBakers } from "@/features/profiles/bakers-provider";
import { useKitchen } from "./kitchen-provider";
import { KITCHEN_NOTE_LIMIT, type KitchenNote } from "./kitchen-tries";
import { prepareKitchenPhoto } from "./prepare-kitchen-photo";

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function KitchenSummary({ recipeId }: { recipeId: string }) {
  const { tries } = useKitchen(recipeId);
  return (
    <a className="kitchen-summary" href="#other-kitchens">
      <span className="kitchen-summary-avatars" aria-hidden="true">
        {tries.slice(0, 3).map((entry) => (
          <BakerAvatar
            key={entry.authorId}
            id={entry.authorId}
            className="kitchen-mini-avatar"
          />
        ))}
        {!tries.length && <ChefHat size={19} strokeWidth={1.4} />}
      </span>
      <span>
        <strong>
          {tries.length
            ? `Tried in ${tries.length} ${tries.length === 1 ? "kitchen" : "kitchens"}`
            : "Be the first to try this"}
        </strong>
        <small>
          {tries.length ? "See how it went" : "Leave a little kitchen note"}{" "}
          <ArrowDown size={12} />
        </small>
      </span>
    </a>
  );
}

function KitchenEditor({
  initial,
  recipeId,
  onClose,
  onSaved,
}: {
  initial?: KitchenNote;
  recipeId: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { saveTry } = useKitchen(recipeId);
  const [note, setNote] = useState(initial?.note ?? "");
  const [photo, setPhoto] = useState(initial?.photo);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const noteField = useRef<HTMLTextAreaElement>(null);
  const uploadVersion = useRef(0);
  useEffect(() => {
    noteField.current?.focus();
    return () => {
      uploadVersion.current += 1;
    };
  }, []);
  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;
    const version = ++uploadVersion.current;
    setError("");
    setUploading(true);
    try {
      const result = await prepareKitchenPhoto(file);
      if (uploadVersion.current === version) setPhoto(result);
    } catch (cause) {
      if (uploadVersion.current === version)
        setError(
          cause instanceof Error
            ? cause.message
            : "This photograph couldn’t be opened. Try another one.",
        );
    } finally {
      if (uploadVersion.current === version) setUploading(false);
    }
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (uploading) return;
    if (!saveTry(recipeId, note, photo)) {
      setError(
        "Your entry couldn’t be saved. Check the note and photograph, then try again.",
      );
      return;
    }
    onSaved();
  }
  return (
    <form
      className="kitchen-editor"
      aria-label={
        initial ? "Edit your recipe attempt" : "Share your recipe attempt"
      }
      onSubmit={submit}
      aria-busy={uploading}
    >
      <div className="kitchen-editor-heading">
        <h3>
          {initial ? "A little update from your kitchen." : "How did it go?"}
        </h3>
        <button
          className="kitchen-icon-button"
          type="button"
          onClick={onClose}
          aria-label="Close recipe attempt form"
        >
          <X size={18} />
        </button>
      </div>
      <p id="kitchen-note-help">
        Your tweaks, your happy accidents, your “next time”. A note and photo
        are optional.
      </p>
      <label htmlFor="kitchen-note">Your kitchen note</label>
      <textarea
        id="kitchen-note"
        ref={noteField}
        value={note}
        onChange={(event) => setNote(event.target.value)}
        maxLength={KITCHEN_NOTE_LIMIT}
        rows={4}
        placeholder="Added a little orange zest. Would make these again…"
        aria-describedby="kitchen-note-help kitchen-note-count"
      />
      <span id="kitchen-note-count" className="kitchen-note-count">
        {note.length}/{KITCHEN_NOTE_LIMIT}
      </span>
      {photo && (
        <div className="kitchen-photo-preview">
          <img src={photo} alt="Your recipe attempt" />
          <button
            type="button"
            disabled={uploading}
            onClick={() => setPhoto(undefined)}
          >
            <X size={14} /> Remove photo
          </button>
        </div>
      )}
      <div className="kitchen-upload">
        <label>
          <Camera size={17} />
          <span>
            {uploading
              ? "Preparing your photograph…"
              : photo
                ? "Change photo"
                : "Add a photo"}
          </span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={uploading}
            onChange={upload}
            aria-label={
              photo ? "Change recipe attempt photo" : "Add recipe attempt photo"
            }
          />
        </label>
        <small>JPG, PNG or WebP · up to 8 MB</small>
      </div>
      {error && (
        <p className="kitchen-error" role="alert">
          {error}
        </p>
      )}
      <footer>
        <span>Demo entry · saved on this device.</span>
        <div>
          <button type="button" className="kitchen-cancel" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="button small" disabled={uploading}>
            {initial ? "Save changes" : "Share my try"}
            <Check size={15} />
          </button>
        </div>
      </footer>
    </form>
  );
}

export function RecipeKitchens({ recipeId }: { recipeId: string }) {
  const { tries, own, ready, storageError, removeTry } = useKitchen(recipeId);
  const { currentBaker } = useBakers();
  const [editing, setEditing] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [message, setMessage] = useState("");
  const editorButton = useRef<HTMLButtonElement>(null);
  function close() {
    setEditing(false);
    requestAnimationFrame(() =>
      editorButton.current?.focus({ preventScroll: true }),
    );
  }
  function edit() {
    setMessage("");
    setConfirmRemove(false);
    setEditing(true);
  }
  return (
    <section
      id="other-kitchens"
      className="recipe-kitchens"
      aria-labelledby="recipe-kitchens-title"
    >
      <header className="kitchen-section-heading">
        <div>
          <p className="book-edition">THE RECIPE, PASSED AROUND</p>
          <h2 id="recipe-kitchens-title">From other kitchens.</h2>
          <p>
            {tries.length
              ? `${tries.length} ${tries.length === 1 ? "baker has" : "bakers have"} given this a go. Here’s how it went.`
              : "A fresh page. Be the first to tell us how it went."}
          </p>
        </div>
        <button
          ref={editorButton}
          type="button"
          className="kitchen-try-button"
          disabled={!ready}
          aria-expanded={editing}
          aria-controls="kitchen-entry-editor"
          onClick={editing ? close : edit}
        >
          {own ? <Pencil size={15} /> : <Plus size={16} />}
          {own ? "Edit your try" : "I tried this"}
        </button>
      </header>
      {storageError && (
        <p className="storage-notice" role="status">
          Your browser can’t save changes right now. Your entry will last for
          this visit.
        </p>
      )}
      <p className="kitchen-status" role="status">
        {message}
      </p>
      <div id="kitchen-entry-editor">
        {editing && (
          <KitchenEditor
            initial={own}
            recipeId={recipeId}
            onClose={close}
            onSaved={() => {
              setMessage(
                own
                  ? "Your kitchen note has been updated."
                  : "Your try has been added to the recipe.",
              );
              close();
            }}
          />
        )}
      </div>
      <div className="kitchen-entries">
        {tries.map((entry) => {
          const isOwn = entry.authorId === CURRENT_BAKER_ID;
          const author = isOwn
            ? currentBaker
            : bakers.find((baker) => baker.id === entry.authorId);
          return (
            <article
              className={`kitchen-entry ${isOwn ? "kitchen-entry-own" : ""}`}
              key={entry.authorId}
            >
              <header>
                <Link
                  href={profileHref(entry.authorId)}
                  className="kitchen-entry-author"
                >
                  <BakerAvatar id={entry.authorId} />
                  <span>
                    <strong>{author?.name ?? "A club baker"}</strong>
                    <span>
                      {isOwn ? "You tried this" : "Tried this recipe"}
                    </span>
                  </span>
                </Link>
                <time dateTime={entry.updatedAt}>
                  {dateFormat.format(new Date(entry.updatedAt))}
                </time>
              </header>
              {entry.photo && (
                <img
                  className="kitchen-entry-photo"
                  src={entry.photo}
                  alt={`${author?.name ?? "A baker"}’s attempt at this recipe`}
                  loading="lazy"
                />
              )}
              <p className="kitchen-entry-note">
                {entry.note ||
                  "Gave this recipe a go. Another good thing from the book."}
              </p>
              {isOwn && (
                <footer>
                  {confirmRemove ? (
                    <div className="kitchen-remove-confirm">
                      <p>Remove your try, including its note and photo?</p>
                      <div>
                        <button
                          type="button"
                          onClick={() => {
                            removeTry(recipeId);
                            setEditing(false);
                            setConfirmRemove(false);
                            setMessage("Your try has been removed.");
                            requestAnimationFrame(() =>
                              editorButton.current?.focus({
                                preventScroll: true,
                              }),
                            );
                          }}
                        >
                          Remove my try
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmRemove(false)}
                        >
                          Keep it
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button type="button" onClick={edit}>
                        <Pencil size={12} /> Edit your kitchen note
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmRemove(true)}
                      >
                        Remove my try
                      </button>
                    </>
                  )}
                </footer>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
