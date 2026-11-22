import type { Metadata } from "next";
import "./globals.css";
import "./application.css";
import "./community-taste.css";
import "./motion.css";
import "./recipe-book.css";
import "./app-chrome.css";
import "./community-grid.css";
import "./mascot-tour.css";
import "./profile-corner.css";
import "./weekly.css";
import { TourProvider } from "@/features/tour/tour-provider";
import { MascotProvider } from "@/features/mascots/mascot-provider";
import { DemoProvider } from "@/features/demo/demo-provider";
import { BakersProvider } from "@/features/profiles/bakers-provider";
import { KitchenProvider } from "@/features/recipe-book/kitchen-provider";
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
          <MascotProvider>
            <BakersProvider>
              <ActivityProvider>
                <KitchenProvider>
                  <TourProvider>{children}</TourProvider>
                </KitchenProvider>
              </ActivityProvider>
            </BakersProvider>
          </MascotProvider>
        </DemoProvider>
      </body>
    </html>
  );
}
