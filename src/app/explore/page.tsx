import { Suspense } from "react";
import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { Explore } from "@/features/explore/explore";
export const metadata: Metadata = { title: "Explore — Crumb Club" };
export default function ExplorePage() {
  return (
    <AppShell>
      <Suspense
        fallback={
          <p role="status" className="app-loading">
            Finding something lovely…
          </p>
        }
      >
        <Explore />
      </Suspense>
    </AppShell>
  );
}
