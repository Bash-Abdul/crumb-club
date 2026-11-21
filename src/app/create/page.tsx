import { Suspense } from "react";
import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { DemoCreator } from "@/features/create/demo-creator";
export const metadata: Metadata = { title: "Share something — Crumb Club" };
export default function Create() {
  return (
    <AppShell>
      <Suspense
        fallback={
          <p role="status" className="app-loading">
            Getting your notebook ready…
          </p>
        }
      >
        <DemoCreator />
      </Suspense>
    </AppShell>
  );
}
