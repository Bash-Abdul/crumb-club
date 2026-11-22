import type { BakingCategory } from "./categories";
export interface ExternalDiscovery {
  id: string;
  title: string;
  description: string;
  image: { src: string; alt: string; attribution: string };
  type: "book" | "guide" | "article" | "bakery";
  label: string;
  topics: readonly (
    BakingCategory | "Bakeries" | "Technique" | "Baking culture"
  )[];
  source: string;
  url: string;
  metadata?: string;
}
// Manually selected destinations, verified 22 November 2026. No remote fetching at runtime.
export const externalDiscoveries: ExternalDiscovery[] = [
  {
    id: "dessert-person",
    title: "A little more confidence, a lot more dessert.",
    description:
      "Claire Saffitz’s Dessert Person pairs sweet and savoury projects with guidance for finding your feet in the kitchen. One for a slow browse and a flour-dusted bookmark.",
    type: "book",
    label: "From the bookshelf",
    topics: ["Cakes", "Cookies", "Pastries", "Baking culture"],
    source: "Penguin Random House",
    url: "https://www.penguinrandomhouse.com/books/609892/dessert-person-by-claire-saffitz/",
    image: {
      src: "/images/dessert-person.jpg",
      alt: "Cover of Dessert Person by Claire Saffitz",
      attribution: "Book cover © Penguin Random House",
    },
    metadata: "Dessert Person · Claire Saffitz",
  },
  {
    id: "tangzhong",
    title: "The little step behind a softer loaf.",
    description:
      "Get to know tangzhong, then see how King Arthur’s bakers use it beyond a plain white loaf.",
    type: "guide",
    label: "Something to learn",
    topics: ["Bread", "Technique"],
    source: "King Arthur Baking",
    url: "https://www.kingarthurbaking.com/blog/2018/10/10/tangzhong-beyond-white-bread",
    image: {
      src: "/images/bread.jpg",
      alt: "Flour-dusted loaves on a kitchen table",
      attribution: "Illustrative photograph from the Crumb Club image library",
    },
    metadata: "A bread-making technique",
  },
  {
    id: "cookie-decorating",
    title: "A quiet afternoon with icing.",
    description:
      "From the first outline to the finishing details: a guide to decorating cookies, with room to find your own style.",
    type: "guide",
    label: "A technique to try",
    topics: ["Cookies", "Technique"],
    source: "King Arthur Baking",
    url: "https://www.kingarthurbaking.com/learn/guides/cookie-decorating",
    image: {
      src: "/images/cookies.jpg",
      alt: "Golden homemade cookies",
      attribution:
        "Illustrative photograph; not an image from the linked guide",
    },
  },
  {
    id: "cookie-tips",
    title: "For the next batch of cookies.",
    description:
      "A handful of practical details to revisit before you reach for the mixing bowl, from measuring to chilling the dough.",
    type: "article",
    label: "Worth reading",
    topics: ["Cookies", "Technique"],
    source: "King Arthur Baking",
    url: "https://www.kingarthurbaking.com/blog/2023/09/27/best-cookie-tips",
    image: {
      src: "/images/cookies.jpg",
      alt: "Chocolate chip cookies ready to share",
      attribution: "Illustrative photograph from the Crumb Club image library",
    },
  },
  {
    id: "e5-bakehouse",
    title: "Under the arches at e5 Bakehouse.",
    description:
      "A Hackney bakehouse with bread, learning and a connection to the ingredients behind it. Meet the bakery through its own story.",
    type: "bakery",
    label: "Beyond the club",
    topics: ["Bread", "Bakeries", "Baking culture"],
    source: "e5 Bakehouse",
    url: "https://e5bakehouse.com/",
    image: {
      src: "/images/bakery-interior.jpg",
      alt: "Warm bakery interior with bread on display",
      attribution:
        "Illustrative bakery photograph; not a photograph of e5 Bakehouse",
    },
    metadata: "Hackney, London · Curated discovery",
  },
];
