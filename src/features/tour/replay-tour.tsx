"use client";
import { useRouter } from "next/navigation";
import { Compass } from "lucide-react";
import { useTour } from "./tour-provider";
export function ReplayTour() {
  const { requestTour, ready } = useTour();
  const router = useRouter();
  return (
    <button
      type="button"
      className="replay-club-tour"
      disabled={!ready}
      onClick={() => {
        requestTour();
        router.push("/app");
      }}
    >
      <Compass size={17} />
      Take a tour of the club
    </button>
  );
}
