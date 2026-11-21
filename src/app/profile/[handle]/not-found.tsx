import Link from "next/link";
import { AppShell } from "@/components/app-shell";
export default function MissingBaker() {
  return (
    <AppShell>
      <div className="app-error">
        <p className="eyebrow">A LITTLE LOST?</p>
        <h1>This baker isn’t here.</h1>
        <p>There’s good company waiting back at the club.</p>
        <Link className="button" href="/app">
          Back to the community
        </Link>
      </div>
    </AppShell>
  );
}
