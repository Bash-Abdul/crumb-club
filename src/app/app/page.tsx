import { Suspense } from "react";
import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { HomeFeed } from "@/features/community/home-feed";
export const metadata: Metadata = { title: "Community Home — Crumb Club" };
export default function Home() {
  return (
    <AppShell>
      <Suspense
        fallback={
          <p role="status" className="app-loading">
            Putting the kettle on…
          </p>
        }
      >
        <HomeFeed />
      </Suspense>
    </AppShell>
  );
}
