"use client";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { Mascot } from "@/features/mascots/mascot";
import { useMascot } from "@/features/mascots/mascot-provider";
import { useTour } from "./tour-provider";
import { clampTourStep, tourSteps } from "./tour-steps";
interface Bounds {
  left: number;
  top: number;
  width: number;
  height: number;
}
function findTarget(name: string) {
  return [
    ...document.querySelectorAll<HTMLElement>(`[data-tour="${name}"]`),
  ].find((element) => {
    const bounds = element.getBoundingClientRect();
    return bounds.width > 0 && bounds.height > 0;
  });
}
export function MascotTour() {
  const pathname = usePathname();
  const { ready: mascotReady } = useMascot();
  const { ready, status, active, requested, startTour, closeTour } = useTour();
  const [index, setIndex] = useState(0);
  const [bounds, setBounds] = useState<Bounds | null>(null);
  const [cardHeight, setCardHeight] = useState(300);
  const [viewport, setViewport] = useState({ width: 1024, height: 768 });
  const card = useRef<HTMLDivElement>(null);
  const nextButton = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const step = tourSteps[clampTourStep(index)];
  useEffect(() => {
    if (
      pathname !== "/app" ||
      !ready ||
      !mascotReady ||
      active ||
      (!requested && status !== null)
    )
      return;
    let observer: MutationObserver | undefined;
    function attempt() {
      if (findTarget("filters") && findTarget("home")) {
        observer?.disconnect();
        setIndex(0);
        setViewport({ width: window.innerWidth, height: window.innerHeight });
        startTour();
        return true;
      }
      return false;
    }
    const timer = window.setTimeout(() => {
      if (!attempt()) {
        observer = new MutationObserver(() => attempt());
        const root = document.querySelector(".app-shell");
        if (root) observer.observe(root, { childList: true, subtree: true });
      }
    }, 700);
    return () => {
      window.clearTimeout(timer);
      observer?.disconnect();
    };
  }, [pathname, ready, mascotReady, active, requested, status, startTour]);
  useEffect(() => {
    if (active && pathname !== "/app") closeTour("skipped");
  }, [active, pathname, closeTour]);
  useEffect(() => {
    if (!active) return;
    previousFocus.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      requestAnimationFrame(() => {
        const target = previousFocus.current;
        if (target && target !== document.body && target.isConnected)
          target.focus({ preventScroll: true });
        else
          document
            .querySelector<HTMLElement>('[data-tour="home"]')
            ?.focus({ preventScroll: true });
      });
    };
  }, [active]);
  useEffect(() => {
    if (!active) return;
    setBounds(null);
    let frame = 0;
    const target = findTarget(step.target);
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "instant"
      : "smooth";
    if (target && window.innerWidth < 768) {
      const header = document.querySelector(".app-topbar");
      const inset = (header?.getBoundingClientRect().height ?? 67) + 12;
      const destination = target.closest(".app-topbar")
        ? 0
        : Math.max(
            0,
            window.scrollY + target.getBoundingClientRect().top - inset,
          );
      window.scrollTo({ top: destination, behavior: motion });
    } else
      target?.scrollIntoView({
        block: "center",
        inline: "nearest",
        behavior: motion,
      });
    function measure() {
      const target = findTarget(step.target);
      setViewport({ width: window.innerWidth, height: window.innerHeight });
      if (target) {
        const rect = target.getBoundingClientRect();
        const left = Math.max(6, rect.left - 7);
        const top = Math.max(6, rect.top - 7);
        setBounds({
          left,
          top,
          width: Math.max(
            0,
            Math.min(window.innerWidth - 6, rect.right + 7) - left,
          ),
          height: Math.max(
            0,
            Math.min(window.innerHeight - 6, rect.bottom + 7) - top,
          ),
        });
      }
      if (card.current)
        setCardHeight(card.current.getBoundingClientRect().height);
    }
    function update() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    }
    const resize = new ResizeObserver(update);
    if (target) resize.observe(target);
    if (card.current) resize.observe(card.current);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    measure();
    nextButton.current?.focus({ preventScroll: true });
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [active, index, step.target]);
  function keyboard(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeTour("skipped");
      return;
    }
    if (event.key !== "Tab") return;
    const controls = [
      ...event.currentTarget.querySelectorAll<HTMLElement>(
        "button:not(:disabled),a[href]",
      ),
    ];
    const first = controls[0],
      last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }
  if (!active) return null;
  const width = Math.min(360, viewport.width - 32);
  const left = Math.min(
    viewport.width - width - 16,
    Math.max(
      16,
      bounds
        ? bounds.left + bounds.width / 2 - width / 2
        : (viewport.width - width) / 2,
    ),
  );
  const below = bounds ? bounds.top + bounds.height + 15 : 0;
  const above = bounds ? bounds.top - cardHeight - 15 : 0;
  const proposedTop = !bounds
    ? (viewport.height - cardHeight) / 2
    : below + cardHeight <= viewport.height - 16
      ? below
      : above >= 16
        ? above
        : (viewport.height - cardHeight) / 2;
  const top = Math.max(
    16,
    Math.min(proposedTop, viewport.height - cardHeight - 16),
  );
  return createPortal(
    <div
      className="mascot-tour"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tour-title"
      aria-describedby="tour-description"
      onKeyDown={keyboard}
    >
      {bounds ? (
        <div className="tour-spotlight" style={bounds} aria-hidden="true" />
      ) : (
        <div className="tour-full-scrim" aria-hidden="true" />
      )}
      <div className="tour-card" ref={card} style={{ left, top, width }}>
        <div className="tour-card-top">
          <Mascot />
          <span>
            A LITTLE LOOK AROUND
            <br />
            <strong>
              {index + 1} of {tourSteps.length}
            </strong>
          </span>
          <button
            type="button"
            className="tour-close"
            aria-label="Skip walkthrough"
            onClick={() => closeTour("skipped")}
          >
            <X size={17} />
          </button>
        </div>
        <h2 id="tour-title">{step.title}</h2>
        <p id="tour-description" aria-live="polite" aria-atomic="true">
          {step.text}
        </p>
        <div className="tour-progress" aria-hidden="true">
          {tourSteps.map((item, position) => (
            <span
              key={item.target}
              className={position <= index ? "complete" : ""}
            />
          ))}
        </div>
        <footer>
          <button
            type="button"
            className="tour-skip"
            onClick={() => closeTour("skipped")}
          >
            Skip tour
          </button>
          <div>
            {index > 0 && (
              <button
                type="button"
                className="tour-back"
                onClick={() => setIndex((value) => clampTourStep(value - 1))}
              >
                <ArrowLeft size={14} />
                Back
              </button>
            )}
            <button
              type="button"
              className="tour-next"
              ref={nextButton}
              onClick={() => {
                if (index === tourSteps.length - 1) closeTour("complete");
                else setIndex((value) => clampTourStep(value + 1));
              }}
            >
              {index === tourSteps.length - 1
                ? "Done"
                : index === 0
                  ? "Show me around"
                  : "Next"}
              <ArrowRight size={14} />
            </button>
          </div>
        </footer>
      </div>
    </div>,
    document.body,
  );
}
