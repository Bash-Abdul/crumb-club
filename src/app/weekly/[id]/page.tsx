import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { bakeWeeks, getBakeWeek } from "@/data/weekly-bakes";
import { WeeklyPage } from "@/features/weekly/weekly-page";
export function generateStaticParams() {
  return bakeWeeks.map((week) => ({ id: week.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return { title: `${getBakeWeek(id)?.title ?? "Weekly bake"} — Crumb Club` };
}
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const week = getBakeWeek(id);
  if (!week) notFound();
  return (
    <AppShell>
      <WeeklyPage week={week} />
    </AppShell>
  );
}
