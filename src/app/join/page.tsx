import type { Metadata } from "next";
import { Onboarding } from "@/features/demo/onboarding";
export const metadata: Metadata = { title: "Join the demo — Crumb Club" };
export default function Join() {
  return <Onboarding />;
}
