import { ArrowUpRight, BookOpen } from "lucide-react";
import type { ExternalDiscovery } from "@/data/external-discoveries";
export function ExternalDiscoveryCard({
  item,
  featured = false,
}: {
  item: ExternalDiscovery;
  featured?: boolean;
}) {
  return (
    <article
      className={`outside-discovery${featured ? " outside-discovery--featured" : ""}`}
      data-discovery-id={item.id}
    >
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${item.title} — ${item.source} (opens in a new tab)`}
      >
        <div
          className={`outside-discovery-image${item.type === "book" ? " outside-discovery-image--book" : ""}`}
        >
          <img src={item.image.src} alt={item.image.alt} loading="lazy" />
          {featured && (
            <span>
              {item.type === "book" ? (
                <BookOpen size={15} />
              ) : (
                <ArrowUpRight size={15} />
              )}{" "}
              {item.type === "book"
                ? "THE CLUB’S READING CORNER"
                : "FROM THE WIDER BAKING WORLD"}
            </span>
          )}
        </div>
        <div className="outside-discovery-copy">
          <p className="outside-label">
            {item.label}
            <ArrowUpRight size={17} />
          </p>
          {item.metadata && <p className="outside-metadata">{item.metadata}</p>}
          <h3>{item.title}</h3>
          <p className="outside-description">{item.description}</p>
          <p className="outside-source">
            {item.source}{" "}
            <span>
              · External{" "}
              {item.type === "book"
                ? "book"
                : item.type === "guide"
                  ? "guide"
                  : item.type === "bakery"
                    ? "discovery"
                    : "article"}
            </span>
          </p>
          {item.type === "bakery" && (
            <small className="outside-image-note">
              Illustrative photograph, not the featured bakery.
            </small>
          )}
        </div>
      </a>
    </article>
  );
}
export function ExternalDiscoveries({
  items,
  filtered = false,
}: {
  items: ExternalDiscovery[];
  filtered?: boolean;
}) {
  if (!items.length) return null;
  const [featured, ...supporting] = items;
  return (
    <section
      className={`outside-section${filtered ? " outside-section--filtered" : ""}`}
      aria-labelledby="outside-heading"
    >
      <div className="explore-section-title">
        <h2 id="outside-heading">
          Worth a little look{filtered && <span> ({items.length})</span>}
        </h2>
        <span>
          From the wider baking world <ArrowUpRight size={14} />
        </span>
      </div>
      <p className="outside-section-intro">
        A few good pages to turn, things to learn, and rabbit holes worth
        following.
      </p>
      <div className="outside-composition">
        <ExternalDiscoveryCard item={featured} featured />
        <div className="outside-supporting">
          {supporting.map((item) => (
            <ExternalDiscoveryCard key={item.id} item={item} />
          ))}
        </div>
      </div>
      <p className="outside-footnote">
        Curated links · opens the original source in a new tab. Photography
        illustrates the topics; book cover from the publisher.
      </p>
    </section>
  );
}
