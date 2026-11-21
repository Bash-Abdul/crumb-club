"use client";
import Link from "next/link";
import { ImagePlus, ChefHat, BookOpen, MapPin } from "lucide-react";
import { BakerAvatar } from "@/features/profiles/baker-avatar";
import { CURRENT_BAKER_ID } from "@/data/bakers";
const actions = [
  { label: "Photo", href: "/create?type=post&photo=1", Icon: ImagePlus },
  { label: "Bake", href: "/create?type=bake", Icon: ChefHat },
  { label: "Recipe", href: "/create?type=recipe", Icon: BookOpen },
  { label: "Find", href: "/create?type=find", Icon: MapPin },
];
export function HomeComposer() {
  return (
    <section className="home-composer" aria-label="Share with the community">
      <Link href="/create?type=post" className="composer-prompt">
        <BakerAvatar id={CURRENT_BAKER_ID} />
        <span>What’s on your mind?</span>
      </Link>
      <nav className="composer-actions" aria-label="Choose what to share">
        {actions.map(({ label, href, Icon }) => (
          <Link href={href} key={label}>
            <Icon size={18} strokeWidth={1.5} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </section>
  );
}
