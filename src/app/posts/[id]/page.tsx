import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { socialPosts, getPost, postLabel } from "@/data/content";
import { AppShell } from "@/components/app-shell";
import { PostDetail } from "@/features/community/post-detail";
export function generateStaticParams() {
  return [
    ...socialPosts.map((post) => ({ id: post.id })),
    { id: "lemon-cake" },
  ];
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = getPost(id);
  return { title: post ? `${postLabel(post)} — Crumb Club` : "Crumb Club" };
}
export default async function Detail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (id === "lemon-cake") redirect("/recipes/lemon-cake");
  const post = getPost(id);
  if (!post) notFound();
  return (
    <AppShell>
      <PostDetail post={post} />
    </AppShell>
  );
}
