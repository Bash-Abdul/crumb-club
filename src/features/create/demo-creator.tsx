"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ChefHat,
  MessageCircle,
  MapPin,
  BookOpen,
  ImagePlus,
  X,
  Check,
  ChevronLeft,
} from "lucide-react";
type Kind = "post" | "bake" | "find" | "recipe";
interface Draft {
  kind: Kind;
  title: string;
  story: string;
  photo: string;
  place: string;
  ingredients: string;
  method: string;
}
const KEY = "crumb-club:draft:v1";
const modes = [
  { kind: "post", label: "A post", Icon: MessageCircle },
  { kind: "bake", label: "A bake", Icon: ChefHat },
  { kind: "find", label: "A little find", Icon: MapPin },
  { kind: "recipe", label: "A recipe", Icon: BookOpen },
] as const;
export function DemoCreator() {
  const params = useSearchParams();
  const requested = modes.find(
    (mode) => mode.kind === params.get("type"),
  )?.kind;
  const initial = requested ?? "post";
  const [draft, setDraft] = useState<Draft>({
    kind: initial,
    title: "",
    story: "",
    photo: "",
    place: "",
    ingredients: "",
    method: "",
  });
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [preview, setPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (requested)
      setDraft({
        kind: requested,
        title: "",
        story: "",
        photo: "",
        place: "",
        ingredients: "",
        method: "",
      });
    setSaved(false);
    setPreview(false);
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const value: unknown = JSON.parse(raw);
        if (value && typeof value === "object") {
          const item = value as Draft;
          if (
            modes.some((mode) => mode.kind === item.kind) &&
            ["title", "story", "photo", "place", "ingredients", "method"].every(
              (key) =>
                typeof (item as unknown as Record<string, unknown>)[key] ===
                "string",
            ) &&
            (!item.photo ||
              /^data:image\/(jpeg|png|webp);base64,/.test(item.photo))
          )
            if (!requested || requested === item.kind) setDraft(item);
            else
              setDraft({
                kind: requested,
                title: "",
                story: "",
                photo: "",
                place: "",
                ingredients: "",
                method: "",
              });
        }
      }
    } catch {
      setError(
        "Your browser could not restore a draft. You can still write one here.",
      );
    }
    setReady(true);
  }, [requested]);
  const canSave =
    draft.kind === "recipe"
      ? !!(
          draft.title.trim() &&
          draft.ingredients.trim() &&
          draft.method.trim()
        )
      : draft.kind === "post"
        ? !!(draft.story.trim() || draft.photo)
        : !!(draft.story.trim() || draft.photo || draft.title.trim());
  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }
  function chooseImage(file: File | undefined) {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Choose a JPG, PNG or WebP photograph.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Choose a photograph smaller than 2 MB for this local demo.");
      return;
    }
    setError("");
    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      update("photo", String(reader.result));
      setUploading(false);
    };
    reader.onerror = () => {
      setError("That photograph couldn’t be opened. Please try another.");
      setUploading(false);
    };
    reader.readAsDataURL(file);
  }
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    try {
      localStorage.setItem(
        KEY,
        JSON.stringify({
          ...draft,
          title: draft.kind === "post" ? "" : draft.title.trim(),
          story: draft.story.trim(),
        }),
      );
      setSaved(true);
      setPreview(false);
    } catch {
      setError(
        "Your browser couldn’t save this draft. It is still here while this page stays open.",
      );
    }
  }
  return (
    <div className="creator-page">
      <header className="creator-heading">
        <Link
          href="/app"
          className="creator-back"
          aria-label="Back to community"
        >
          <ChevronLeft size={22} />
        </Link>
        <div>
          <h1>Share a little something.</h1>
          <p>A proud moment. A happy accident. All welcome.</p>
        </div>
      </header>
      <p className="creator-demo">
        Demo draft · saved on this device, never published
      </p>
      {saved ? (
        <section className="draft-success" role="status">
          <span>
            <Check size={28} />
          </span>
          <h2>Your draft is tucked away.</h2>
          <p>
            “{draft.title || draft.story.slice(0, 70) || "Your photo post"}” is
            saved in this browser. You can return to Create to keep working on
            it.
          </p>
          <p>Posting to the community is coming in a later milestone.</p>
          <button className="button" onClick={() => setSaved(false)}>
            Keep editing
          </button>
          <Link href="/app" className="small-text-link">
            Back to the community
          </Link>
        </section>
      ) : (
        <form onSubmit={save}>
          <fieldset className="creator-types">
            <legend className="sr-only">What would you like to share?</legend>
            {modes.map(({ kind, label, Icon }) => (
              <label
                key={kind}
                className={draft.kind === kind ? "selected" : ""}
              >
                <input
                  type="radio"
                  name="post-type"
                  checked={draft.kind === kind}
                  onChange={() => update("kind", kind)}
                />
                <Icon size={17} />
                {label}
              </label>
            ))}
          </fieldset>
          {preview ? (
            <article className="draft-preview">
              <p className="eyebrow">YOUR DRAFT PREVIEW</p>
              {draft.photo && (
                <img
                  src={draft.photo}
                  alt={draft.title || "Your bake photograph"}
                />
              )}
              {draft.kind !== "post" && (
                <h2>{draft.title || "Your lovely creation"}</h2>
              )}
              <p>{draft.story || "Your story will appear here."}</p>
              {draft.kind === "find" && <p>{draft.place}</p>}
              {draft.kind === "recipe" && (
                <>
                  <h3>Ingredients</h3>
                  <p>{draft.ingredients}</p>
                  <h3>Method</h3>
                  <p>{draft.method}</p>
                </>
              )}
            </article>
          ) : (
            <>
              {draft.kind === "post" && (
                <label
                  className="creator-field general-post-field"
                  htmlFor="draft-story"
                >
                  What’s on your mind?
                  <textarea
                    id="draft-story"
                    value={draft.story}
                    onChange={(event) => update("story", event.target.value)}
                    rows={5}
                    maxLength={2000}
                    placeholder="A thought, a question, a little baking memory…"
                  />
                </label>
              )}
              <div
                className={`photo-upload ${draft.kind === "post" ? "general-photo" : ""} ${draft.photo ? "has-photo" : ""}`}
              >
                {draft.photo ? (
                  <>
                    <img
                      src={draft.photo}
                      alt={draft.title || "Preview of your chosen photograph"}
                    />
                    <button
                      type="button"
                      className="remove-photo"
                      aria-label="Remove photograph"
                      onClick={() => {
                        update("photo", "");
                        if (fileRef.current) fileRef.current.value = "";
                      }}
                    >
                      <X size={18} />
                    </button>
                  </>
                ) : (
                  <label htmlFor="draft-photo">
                    <ImagePlus size={32} strokeWidth={1.2} />
                    <strong>
                      {uploading
                        ? "Opening your photograph…"
                        : draft.kind === "post"
                          ? "Add a photograph (optional)"
                          : "Start with a photograph"}
                    </strong>
                    <span>JPG, PNG or WebP · up to 2 MB</span>
                  </label>
                )}
                <input
                  ref={fileRef}
                  id="draft-photo"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className={draft.photo ? "photo-replace" : "sr-only"}
                  aria-label={
                    draft.photo ? "Replace photograph" : "Choose photograph"
                  }
                  onChange={(event) => chooseImage(event.target.files?.[0])}
                />
              </div>
              {draft.kind !== "post" && (
                <>
                  {" "}
                  <label className="creator-field" htmlFor="draft-title">
                    Give it a title{" "}
                    {draft.kind !== "recipe" && <span>(optional)</span>}
                    <input
                      id="draft-title"
                      value={draft.title}
                      onChange={(event) => update("title", event.target.value)}
                      required={draft.kind === "recipe"}
                      maxLength={100}
                      placeholder={
                        draft.kind === "find"
                          ? "A new favourite, around the corner"
                          : "My Sunday cinnamon buns"
                      }
                    />
                  </label>
                  <label className="creator-field" htmlFor="draft-story">
                    {draft.kind === "find"
                      ? "What made it special?"
                      : "The story behind the crumbs"}
                    <textarea
                      id="draft-story"
                      value={draft.story}
                      onChange={(event) => update("story", event.target.value)}
                      rows={3}
                      maxLength={2000}
                      placeholder="Tell us a little about it…"
                    />
                  </label>
                </>
              )}
              {draft.kind === "find" && (
                <label className="creator-field" htmlFor="draft-place">
                  Bakery or location <span>(optional)</span>
                  <input
                    id="draft-place"
                    value={draft.place}
                    onChange={(event) => update("place", event.target.value)}
                    maxLength={150}
                    placeholder="That little bakery on the high street"
                  />
                </label>
              )}
              {draft.kind === "recipe" && (
                <>
                  <label className="creator-field" htmlFor="draft-ingredients">
                    Ingredients
                    <textarea
                      id="draft-ingredients"
                      value={draft.ingredients}
                      onChange={(event) =>
                        update("ingredients", event.target.value)
                      }
                      required
                      maxLength={4000}
                      rows={4}
                      placeholder="One ingredient per line, with quantities"
                    />
                  </label>
                  <label className="creator-field" htmlFor="draft-method">
                    Method
                    <textarea
                      id="draft-method"
                      value={draft.method}
                      onChange={(event) => update("method", event.target.value)}
                      required
                      maxLength={6000}
                      rows={5}
                      placeholder="Walk us through it, one step at a time"
                    />
                  </label>
                </>
              )}
            </>
          )}
          <p className="creator-error" role="alert">
            {error}
          </p>
          <div className="creator-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => setPreview(!preview)}
            >
              {preview ? "Back to editing" : "Preview draft"}
            </button>
            <button
              className="button"
              disabled={!ready || uploading || !canSave}
            >
              Save demo draft
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
