"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="app-main app-error">
      <p className="eyebrow">A LITTLE KITCHEN HICCUP</p>
      <h1>Let’s try that again.</h1>
      <p>Something stopped the feed from loading. Give it another go.</p>
      <button className="button" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
