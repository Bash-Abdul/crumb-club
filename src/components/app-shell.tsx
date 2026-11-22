"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import {
  Home,
  Compass,
  Plus,
  UserRound,
  Bookmark,
  BookOpen,
  MapPin,
  Croissant,
} from "lucide-react";
import { Brand } from "./brand";
import { useBakers } from "@/features/profiles/bakers-provider";
import { BakerAvatar } from "@/features/profiles/baker-avatar";
import { CURRENT_BAKER_ID } from "@/data/bakers";
const links = [
  { href: "/app", label: "Home", Icon: Home },
  { href: "/explore", label: "Explore", Icon: Compass },
  { href: "/create", label: "Create", Icon: Plus },
  { href: "/profile", label: "Profile", Icon: UserRound },
];
function CollectionLinks() {
  const params = useSearchParams();
  const pathname = usePathname();
  return (
    <nav className="collection-nav" aria-label="Your collections">
      {[
        { filter: "saved", label: "Saved", Icon: Bookmark },
        { filter: "recipes", label: "Recipes", Icon: BookOpen },
        { filter: "finds", label: "Little finds", Icon: MapPin },
      ].map(({ filter, label, Icon }) => (
        <Link
          key={filter}
          href={filter === "recipes" ? "/recipes" : `/app?feed=${filter}`}
          aria-current={
            (filter === "recipes" && pathname.startsWith("/recipes")) ||
            (pathname === "/app" && params.get("feed") === filter)
              ? "page"
              : undefined
          }
        >
          <Icon size={17} />
          {label}
        </Link>
      ))}
    </nav>
  );
}
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentBaker, hasProfile } = useBakers();
  const name = currentBaker.name;
  const current = (href: string) =>
    pathname === href ||
    (href === "/recipes" && pathname.startsWith("/recipes/")) ||
    (href === "/profile" && pathname.startsWith("/profile/")) ||
    (href === "/app" && pathname.startsWith("/posts/"));
  return (
    <div
      className={`app-shell ${pathname.startsWith("/recipes/") ? "app-shell--recipe" : ""}`}
    >
      <a className="skip" href="#community-main">
        Skip to content
      </a>
      <aside className="app-sidebar">
        <Brand />
        <nav className="app-desktop-nav" aria-label="Community navigation">
          {links.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              aria-label={label}
              aria-current={current(href) ? "page" : undefined}
            >
              <Icon size={19} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-collections">
          <p>Your collections</p>
          <Suspense fallback={null}>
            <CollectionLinks />
          </Suspense>
        </div>
        <div className="sidebar-bottom">
          <div className="sidebar-community-note">
            <span className="sidebar-croissant" aria-hidden="true">
              <Croissant size={57} strokeWidth={1.25} />
              <svg viewBox="0 0 28 28" className="sidebar-note-rays">
                <path d="M7 17 3 13M12 9 11 3M20 12 25 7" />
              </svg>
            </span>
            <p>A community for bakers, bakery lovers and the just curious.</p>
          </div>
          <Link href="/" className="sidebar-about">
            A little about the club
          </Link>
          <Link
            href={hasProfile ? "/profile" : "/join"}
            className="sidebar-user"
          >
            <BakerAvatar id={CURRENT_BAKER_ID} />
            <span>
              <strong>{name}</strong>
              <small>
                {hasProfile ? "Your demo profile" : "Make yourself at home"}
              </small>
            </span>
          </Link>
          <p className="sidebar-demo">Demo community · saved on this device</p>
        </div>
      </aside>
      <header className="app-mobile-header">
        <Brand />
        <Link
          href={hasProfile ? "/profile" : "/join"}
          className="mobile-avatar"
          aria-label={hasProfile ? "Your demo profile" : "Enter demo mode"}
        >
          <BakerAvatar id={CURRENT_BAKER_ID} />
        </Link>
      </header>
      <main id="community-main" className="app-main">
        {children}
      </main>
      <nav className="app-mobile-nav" aria-label="Mobile community navigation">
        {[
          ...links.slice(0, 3),
          { href: "/recipes", label: "Recipes", Icon: BookOpen },
          links[3],
        ].map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            aria-label={label}
            aria-current={current(href) ? "page" : undefined}
          >
            <Icon size={22} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
