"use client";
import { CURRENT_BAKER_ID, bakers } from "@/data/bakers";
import { useBakers } from "./bakers-provider";
export function BakerAvatar({
  id,
  className = "avatar",
  initials,
}: {
  id: string;
  className?: string;
  initials?: string;
}) {
  const { currentBaker } = useBakers();
  const baker =
    id === CURRENT_BAKER_ID
      ? currentBaker
      : bakers.find((person) => person.id === id);
  return (
    <span className={className} aria-hidden="true">
      {baker?.avatar ? (
        <img src={baker.avatar} alt="" />
      ) : (
        (baker?.initials ?? initials ?? "BC")
      )}
    </span>
  );
}
