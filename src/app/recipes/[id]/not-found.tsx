import Link from "next/link";
import { AppShell } from "@/components/app-shell";
export default function MissingRecipe() {
  return (
    <AppShell>
      <div className="app-error">
        <p className="eyebrow">A PAGE OUT OF THE RECIPE BOOK</p>
        <h1>This recipe isn’t here.</h1>
        <p>There are more good things waiting in the club.</p>
        <Link href="/app?feed=recipes" className="button">
          Browse shared recipes
        </Link>
      </div>
    </AppShell>
  );
}
