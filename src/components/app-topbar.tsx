"use client";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, Bell, Search, X } from "lucide-react";
import { Brand } from "./brand";
import { useBakers } from "@/features/profiles/bakers-provider";
import { Mascot } from "@/features/mascots/mascot";

function SearchControl({
  active,
  onSubmit,
}: {
  active: boolean;
  onSubmit: () => void;
}) {
  const params = useSearchParams();
  const router = useRouter();
  const external = params.get("q") ?? "";
  const [query, setQuery] = useState(external);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => setQuery(external), [external]);
  useEffect(() => {
    if (active) input.current?.focus();
  }, [active]);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    router.push(value ? `/explore?q=${encodeURIComponent(value)}` : "/explore");
    onSubmit();
  }
  return (
    <form
      className="topbar-search"
      role="search"
      aria-label="Search the club"
      action="/explore"
      onSubmit={submit}
    >
      <Search size={18} aria-hidden="true" />
      <label className="sr-only" htmlFor="club-search">
        Search Crumb Club
      </label>
      <input
        id="club-search"
        ref={input}
        name="q"
        type="search"
        placeholder="Search Crumb Club…"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        autoComplete="off"
      />
      <button type="submit" aria-label="Search the club">
        <ArrowRight size={16} />
      </button>
    </form>
  );
}
function SearchFallback() {
  return (
    <form
      className="topbar-search"
      role="search"
      aria-label="Search the club"
      action="/explore"
    >
      <Search size={18} />
      <label className="sr-only" htmlFor="club-search">
        Search Crumb Club
      </label>
      <input
        id="club-search"
        type="search"
        name="q"
        placeholder="Search Crumb Club…"
      />
      <button type="submit" aria-label="Search the club">
        <ArrowRight size={16} />
      </button>
    </form>
  );
}
export function AppTopbar() {
  const { currentBaker } = useBakers();
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationRoot = useRef<HTMLDivElement>(null);
  const bell = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    setNotificationsOpen(false);
    setSearchOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!notificationsOpen) return;
    closeButton.current?.focus();
    function outside(event: PointerEvent) {
      if (!notificationRoot.current?.contains(event.target as Node))
        setNotificationsOpen(false);
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setNotificationsOpen(false);
        bell.current?.focus();
      }
    }
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [notificationsOpen]);
  return (
    <header className="app-topbar" data-search-open={searchOpen}>
      <div className="topbar-brand">
        <Brand />
      </div>
      <Suspense fallback={<SearchFallback />}>
        <SearchControl
          active={searchOpen}
          onSubmit={() => {
            setSearchOpen(false);
            setNotificationsOpen(false);
          }}
        />
      </Suspense>
      <div className="topbar-controls">
        <button
          type="button"
          className="topbar-icon-button topbar-search-toggle"
          aria-label={searchOpen ? "Close search" : "Open search"}
          aria-expanded={searchOpen}
          aria-controls="club-search"
          onClick={() => setSearchOpen(!searchOpen)}
        >
          {searchOpen ? <X size={20} /> : <Search size={20} />}
        </button>
        <div className="topbar-notifications" ref={notificationRoot}>
          <button
            type="button"
            className="topbar-icon-button"
            ref={bell}
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
            aria-controls="club-notifications"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
          >
            <Bell size={20} />
          </button>
          {notificationsOpen && (
            <div
              id="club-notifications"
              className="notification-panel"
              role="dialog"
              aria-label="Notifications"
            >
              <div className="notification-panel-heading">
                <h2>Notifications</h2>
                <button
                  type="button"
                  className="topbar-icon-button"
                  ref={closeButton}
                  aria-label="Close notifications"
                  onClick={() => {
                    setNotificationsOpen(false);
                    bell.current?.focus();
                  }}
                >
                  <X size={17} />
                </button>
              </div>
              <Mascot />
              <h3>A quiet moment.</h3>
              <p>
                Your club updates will appear here.
                <br />
                For now, there’s something good to discover.
              </p>
              <Link href="/explore" onClick={() => setNotificationsOpen(false)}>
                Explore the club
              </Link>
            </div>
          )}
        </div>
        <Link
          className="topbar-profile"
          href="/profile"
          aria-label={`Your profile, ${currentBaker.name}`}
        >
          <span>{currentBaker.initials}</span>
        </Link>
      </div>
    </header>
  );
}
