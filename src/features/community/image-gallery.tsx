"use client";
import { useId, useRef, useState, useEffect, type KeyboardEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ContentImage } from "./types";
export function ImageGallery({
  images,
  label,
  detail = false,
}: {
  images: readonly ContentImage[];
  label: string;
  detail?: boolean;
}) {
  const track = useRef<HTMLDivElement>(null);
  const current = useRef(0);
  const [index, setIndex] = useState(0);
  const first = images[0];
  const knownRatio =
    first?.width && first?.height ? first.width / first.height : undefined;
  const [loadedRatio, setLoadedRatio] = useState<number>();
  const ratio = knownRatio ?? loadedRatio ?? 1;
  const help = useId();
  useEffect(() => {
    if (knownRatio) return;
    const image = track.current?.querySelector("img");
    if (image?.complete && image.naturalWidth && image.naturalHeight) {
      setLoadedRatio(image.naturalWidth / image.naturalHeight);
    }
  }, [knownRatio, first?.src]);
  const multiple = images.length > 1;
  useEffect(() => {
    const element = track.current;
    if (!element) return;
    let lastWidth = element.clientWidth;
    const observer = new ResizeObserver(() => {
      const width = element.clientWidth;
      // The initial notification and height-only changes must not cancel a
      // navigation that has already started during hydration or image loading.
      if (!width || width === lastWidth) return;
      lastWidth = width;
      element.scrollTo({
        left: current.current * element.clientWidth,
        behavior: "instant",
      });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  function goTo(value: number) {
    const element = track.current;
    if (!element) return;
    const bounded = Math.max(0, Math.min(images.length - 1, value));
    element.scrollTo({
      left: bounded * element.clientWidth,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }
  function keyboard(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget || !multiple) return;
    const next =
      event.key === "ArrowRight"
        ? index + 1
        : event.key === "ArrowLeft"
          ? index - 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? images.length - 1
              : null;
    if (next === null) return;
    event.preventDefault();
    goTo(next);
  }
  return (
    <div
      className={`image-gallery ${detail ? "detail-gallery" : ""}`}
      role="region"
      aria-roledescription={multiple ? "carousel" : undefined}
      aria-label={`${label} photographs`}
    >
      <div
        ref={track}
        className="gallery-track"
        style={{ aspectRatio: ratio }}
        tabIndex={multiple ? 0 : undefined}
        aria-label={multiple ? "Photo gallery" : undefined}
        aria-describedby={multiple ? help : undefined}
        onKeyDown={keyboard}
        onScroll={(event) => {
          const element = event.currentTarget;
          // A hidden or resizing track can temporarily have no width.
          if (!element.clientWidth) return;
          const value = Math.max(
            0,
            Math.min(
              images.length - 1,
              Math.round(element.scrollLeft / element.clientWidth),
            ),
          );
          current.current = value;
          setIndex(value);
        }}
      >
        {images.map((image, position) => (
          <div
            key={`${image.src}-${position}`}
            className="gallery-slide"
            role="group"
            aria-roledescription="slide"
            aria-label={`Photo ${position + 1} of ${images.length}`}
            aria-hidden={position !== index}
          >
            <img
              src={image.src}
              alt={image.alt}
              loading={detail && position === 0 ? "eager" : "lazy"}
              width={image.width}
              height={image.height}
              onLoad={
                position === 0 && !knownRatio
                  ? (event) => {
                      const photo = event.currentTarget;
                      if (photo.naturalWidth && photo.naturalHeight)
                        setLoadedRatio(
                          photo.naturalWidth / photo.naturalHeight,
                        );
                    }
                  : undefined
              }
              draggable={false}
            />
          </div>
        ))}
      </div>
      {multiple && (
        <>
          <p id={help} className="sr-only">
            Swipe through photographs, or focus the gallery and use the left and
            right arrow keys. Home and End select the first and last photograph.
          </p>
          <span className="gallery-count" aria-hidden="true">
            {index + 1}/{images.length}
          </span>
          <button
            className="gallery-arrow gallery-previous"
            type="button"
            aria-label={`Previous photograph in ${label}`}
            disabled={index === 0}
            onClick={() => goTo(index - 1)}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            className="gallery-arrow gallery-next"
            type="button"
            aria-label={`Next photograph in ${label}`}
            disabled={index === images.length - 1}
            onClick={() => goTo(index + 1)}
          >
            <ChevronRight size={20} />
          </button>
          <div className="gallery-pagination">
            <span className="sr-only" role="status" aria-live="polite">
              Photo {index + 1} of {images.length}
            </span>
            {images.map((image, position) => (
              <button
                key={`${image.src}-dot-${position}`}
                type="button"
                aria-label={`Show photograph ${position + 1} in ${label}`}
                aria-current={position === index ? "true" : undefined}
                onClick={() => goTo(position)}
              >
                <span />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
