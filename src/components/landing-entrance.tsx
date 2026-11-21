"use client";
import { useEffect, useState, type ReactNode } from "react";
import { useHydrated } from "@/hooks/use-hydrated";
import { ArrowRight, Wheat } from "lucide-react";

export function LandingEntrance({ children }: { children: ReactNode }) {
  const hydrated = useHydrated();
  const [intro, setIntro] = useState<"playing" | "complete" | "skipped">(
    "playing",
  );
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finish = () =>
      setIntro((current) => (current === "playing" ? "complete" : current));
    const handlePreference = () => {
      if (media.matches) finish();
    };
    handlePreference();
    // CSS also dismisses the overlay, so a delayed or unavailable script never
    // leaves the landing page covered. This handles a missed animationend event.
    const fallback = window.setTimeout(finish, 2800);
    media.addEventListener("change", handlePreference);
    return () => {
      window.clearTimeout(fallback);
      media.removeEventListener("change", handlePreference);
    };
  }, []);
  return (
    <div className="landing-experience" data-intro={intro}>
      {intro === "playing" && (
        <div
          className="club-intro"
          onAnimationEnd={(event) => {
            if (event.target === event.currentTarget) setIntro("complete");
          }}
        >
          <div className="intro-art" aria-hidden="true">
            <span className="intro-overline">
              A LITTLE CORNER. A WHOLE LOT OF HEART.
            </span>
            <Wheat className="intro-wheat" size={52} strokeWidth={1.25} />
            <div className="intro-wordmark">
              <span className="intro-word-mask">
                <span className="intro-word intro-word-first">Crumb</span>
              </span>
              <span className="intro-word-mask">
                <span className="intro-word intro-word-second">Club</span>
              </span>
              <span className="intro-asterisk">✳</span>
            </div>
            <p className="intro-tagline">Good things are better shared.</p>
            <span className="intro-rule" />
          </div>
          {hydrated && (
            <button
              type="button"
              className="intro-skip"
              onClick={() => setIntro("skipped")}
              aria-label="Skip Crumb Club introduction"
            >
              Skip intro <ArrowRight size={15} />
            </button>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
