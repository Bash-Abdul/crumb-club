"use client";
import Image from "next/image";
import { Check } from "lucide-react";
import { useMascot } from "./mascot-provider";
import { mascotOptions, type MascotId } from "./mascots";
export function Mascot({
  id,
  className = "",
  decorative = true,
  sizes = "(max-width: 760px) 120px, 180px",
}: {
  id?: MascotId;
  className?: string;
  decorative?: boolean;
  sizes?: string;
}) {
  const { mascot } = useMascot();
  const selected = mascotOptions.find((item) => item.id === (id ?? mascot))!;
  return (
    <span className={`club-mascot ${className}`} data-mascot={selected.id}>
      <Image
        src={`/mascots/${selected.id}.png`}
        alt={decorative ? "" : selected.name}
        width={240}
        height={180}
        sizes={sizes}
      />
    </span>
  );
}
export function MascotPicker({
  value,
  onChange,
  disabled = false,
}: {
  value: MascotId;
  onChange: (id: MascotId) => void;
  disabled?: boolean;
}) {
  return (
    <fieldset className="mascot-options" disabled={disabled}>
      <legend className="sr-only">Choose your mascot</legend>
      {mascotOptions.map((item) => (
        <label key={item.id} className={item.id === value ? "selected" : ""}>
          <input
            type="radio"
            name="mascot"
            value={item.id}
            checked={item.id === value}
            onChange={() => onChange(item.id)}
          />
          <Mascot id={item.id} />
          <strong>{item.name}</strong>
          <small>{item.description}</small>
          <span className="mascot-choice-mark" aria-hidden="true">
            {item.id === value ? <Check size={12} /> : null}
          </span>
        </label>
      ))}
    </fieldset>
  );
}
