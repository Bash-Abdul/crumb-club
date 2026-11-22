"use client";
import { useState } from "react";
import { Mascot, MascotPicker } from "./mascot";
import { useMascot } from "./mascot-provider";
import { mascotOptions } from "./mascots";
export function ProfileMascot() {
  const { mascot, chooseMascot, ready, storageError } = useMascot();
  const [open, setOpen] = useState(false);
  const selected = mascotOptions.find((item) => item.id === mascot)!;
  return (
    <section className="profile-mascot">
      <div className="profile-mascot-heading">
        <Mascot />
        <div>
          <p className="eyebrow">YOUR LITTLE COMPANION</p>
          <h2>{selected.name}</h2>
          <p>A familiar face around your club.</p>
        </div>
        <button
          type="button"
          disabled={!ready}
          aria-expanded={open}
          aria-controls="profile-mascot-options"
          onClick={() => setOpen(!open)}
        >
          {open ? "Done" : "Change mascot"}
        </button>
      </div>
      <div id="profile-mascot-options">
        {open && (
          <MascotPicker
            value={mascot}
            onChange={chooseMascot}
            disabled={!ready}
          />
        )}
      </div>
      {storageError && (
        <p className="storage-notice" role="status">
          Your mascot choice will last for this visit. Your browser can’t save
          it right now.
        </p>
      )}
    </section>
  );
}
