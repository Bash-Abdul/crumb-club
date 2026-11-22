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
} from "lucide-react";
import { Brand } from "./brand";
import { MascotTour } from "@/features/tour/mascot-tour";
import { useTour } from "@/features/tour/tour-provider";
import { AppTopbar } from "./app-topbar";
import { Mascot } from "@/features/mascots/mascot";
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
  const { active: tourActive } = useTour();
  const current = (href: string) =>
    pathname === href ||
    (href === "/recipes" && pathname.startsWith("/recipes/")) ||
    (href === "/profile" && pathname.startsWith("/profile/")) ||
    (href === "/app" && pathname.startsWith("/posts/"));
  return (
    <>
      <div
        inert={tourActive || undefined}
        className={`app-shell ${pathname.startsWith("/recipes/") ? "app-shell--recipe" : ""} ${pathname === "/app" ? "app-shell--home" : ""}`}
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
            <Mascot className="sidebar-rail-companion" />
            <div className="sidebar-community-note">
              <Mascot className="sidebar-companion" />
              <p>A community for bakers, bakery lovers and the just curious.</p>
            </div>
          </div>
        </aside>
        <div className="app-main">
          <AppTopbar />
          <main id="community-main">{children}</main>
        </div>
        <nav
          className="app-mobile-nav"
          aria-label="Mobile community navigation"
        >
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
      <MascotTour />
    </>
  );
}
