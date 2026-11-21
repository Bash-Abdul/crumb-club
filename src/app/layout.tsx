import type { Metadata } from "next";
import "./globals.css";
import "./application.css";
import "./community-taste.css";
import "./motion.css";
import "./recipe-book.css";
import { DemoProvider } from "@/features/demo/demo-provider";
import { BakersProvider } from "@/features/profiles/bakers-provider";
import { ActivityProvider } from "@/features/community/activity-provider";
export const metadata: Metadata = {
  title: "Crumb Club — For the love of all things baked",
  description:
    "A cosy corner for the things we bake, the treats we discover, and the people who love them.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <DemoProvider>
          <BakersProvider>
            <ActivityProvider>{children}</ActivityProvider>
          </BakersProvider>
        </DemoProvider>
      </body>
    </html>
  );
}
