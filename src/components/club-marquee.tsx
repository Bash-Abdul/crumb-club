"use client";
import { Fragment, useState } from "react";
import { useHydrated } from "@/hooks/use-hydrated";
import { Pause, Play, Wheat } from "lucide-react";

const mottoes = [
  "Made with love",
  "Best shared",
  "A little flour, a little joy",
  "Everyone’s welcome",
];

export function ClubMarquee() {
  const hydrated = useHydrated();
  const [paused, setPaused] = useState(false);
  return (
    <div
      className="ribbon club-marquee"
      role="region"
      aria-label="A little Crumb Club joy"
    >
      <p className="sr-only">{mottoes.join(". ")}.</p>
      <div
        className="marquee-track"
        data-paused={paused}
        data-ready={hydrated}
        aria-hidden="true"
      >
        {[0, 1].map((copy) => (
          <div className="marquee-group" key={copy}>
            {mottoes.map((motto) => (
              <Fragment key={motto}>
                <span>{motto}</span>
                <Wheat size={19} strokeWidth={1.4} />
              </Fragment>
            ))}
          </div>
        ))}
      </div>
      {hydrated && (
        <button
          type="button"
          className="marquee-toggle"
          aria-label={paused ? "Play marquee" : "Pause marquee"}
          aria-pressed={paused}
          onClick={() => setPaused((value) => !value)}
        >
          {paused ? <Play size={15} /> : <Pause size={15} />}
        </button>
      )}
    </div>
  );
}
