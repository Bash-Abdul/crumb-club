import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { DemoProfile } from "@/features/demo/demo-profile";
export const metadata: Metadata = { title: "Your little corner — Crumb Club" };
export default function Profile() {
  return (
    <AppShell>
      <DemoProfile />
    </AppShell>
  );
}
