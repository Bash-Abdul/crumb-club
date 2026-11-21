"use client";
import { useEffect } from "react";

export function LandingMotion() {
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!("IntersectionObserver" in window)) return;
    let observer: IntersectionObserver | undefined;
    function clear() {
      observer?.disconnect();
      elements.forEach((element) => element.removeAttribute("data-motion"));
    }
    function setup() {
      clear();
      if (media.matches) return;
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.setAttribute("data-motion", "visible");
            observer?.unobserve(entry.target);
          });
        },
        { threshold: 0.08 },
      );
      elements.forEach((element) => {
        // Above-the-fold content has its own entrance; don't hide it on mount.
        if (element.getBoundingClientRect().top < window.innerHeight * 0.95)
          return;
        element.setAttribute("data-motion", "waiting");
        observer?.observe(element);
      });
    }
    setup();
    media.addEventListener("change", setup);
    return () => {
      clear();
      media.removeEventListener("change", setup);
    };
  }, []);
  return null;
}
