import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { bakers } from "@/data/bakers";
import { AppShell } from "@/components/app-shell";
import { DemoProfile } from "@/features/demo/demo-profile";
export function generateStaticParams() {
  return bakers.map((baker) => ({ handle: baker.handle }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const baker = bakers.find((person) => person.handle === handle);
  return {
    title: baker
      ? `${baker.name} (@${baker.handle}) — Crumb Club`
      : "Baker not found — Crumb Club",
    description: baker?.bio,
  };
}
export default async function PublicProfile({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  if (handle === "you") redirect("/profile");
  const baker = bakers.find((person) => person.handle === handle);
  if (!baker) notFound();
  return (
    <AppShell>
      <DemoProfile bakerId={baker.id} />
    </AppShell>
  );
}
