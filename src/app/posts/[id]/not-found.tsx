import Link from "next/link";
import { AppShell } from "@/components/app-shell";
export default function MissingPost() {
  return (
    <AppShell>
      <div className="app-error">
        <p className="eyebrow">NOT A CRUMB LEFT</p>
        <h1>This story isn’t here.</h1>
        <p>
          The link might be out of date. There are plenty of good things waiting
          back at the club.
        </p>
        <Link href="/app" className="button">
          Back to the community
        </Link>
      </div>
    </AppShell>
  );
}
