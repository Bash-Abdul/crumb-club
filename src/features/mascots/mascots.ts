export const mascotOptions = [
  {
    id: "croissant",
    name: "The Croissant",
    description: "A little flaky. Always lovely.",
  },
  {
    id: "cookie",
    name: "The Cookie",
    description: "Sweet company, wherever you go.",
  },
  {
    id: "baker",
    name: "The Baker",
    description: "Apron on. Something good awaits.",
  },
  {
    id: "crumb",
    name: "The Crumb",
    description: "Small, happy, right at home.",
  },
] as const;
export type MascotId = (typeof mascotOptions)[number]["id"];
export const DEFAULT_MASCOT: MascotId = "crumb";
export function readMascot(value: unknown): MascotId {
  return (
    mascotOptions.find((mascot) => mascot.id === value)?.id ?? DEFAULT_MASCOT
  );
}
