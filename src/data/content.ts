import type {
  Post,
  Recipe,
  FeedItem,
  ReactionTarget,
} from "@/features/community/types";
export const socialPosts: Post[] = [
  {
    id: "sunday-buns",
    title: "Sunday cinnamon buns",
    kind: "bake",
    author: {
      id: "sophie",
      name: "Sophie M.",
      initials: "SM",
      bio: "Learning one bake at a time. Big believer in a second cup of coffee.",
    },
    time: "2 hours ago",
    images: [
      {
        src: "/images/buns.jpg",
        width: 1200,
        height: 1600,
        alt: "Homemade cinnamon buns topped with pearl sugar",
      },
      {
        src: "/images/buns-proofing.jpg",
        width: 1200,
        height: 1559,
        alt: "Cinnamon dough spirals in a tray before baking",
      },
      {
        src: "/images/buns-table.jpg",
        width: 1200,
        height: 797,
        alt: "Golden cinnamon buns ready to share",
      },
    ],
    caption:
      "My first cinnamon buns. A little wonky, a lot of cinnamon. Would absolutely make again. I finally stopped saving cinnamon bun recipes and actually made some. The kitchen smelled incredible, even if the dough seemed to end up on every surface. A couple unrolled in the oven and the middle ones are definitely bigger than the rest. Still warm, with a cup of coffee? A very good Sunday. Next time I’ll leave a little more space in the tin.",
    recipeId: "cinnamon-buns",
    likes: 128,
    comments: [
      {
        id: "buns-1",
        author: "Amelia R.",
        initials: "AR",
        text: "Those swirls! The wonky ones are always the best ones.",
      },
      {
        id: "buns-2",
        author: "Noor K.",
        initials: "NK",
        text: "This is my sign to finally try making them.",
      },
    ],
    publishedAt: "2026-11-20T10:00:00Z",
    category: "Pastries",
  },
  {
    id: "little-bakery",
    title: "A new Saturday ritual",
    kind: "discovery",
    author: {
      id: "james",
      name: "James L.",
      initials: "JL",
      bio: "Weekend wanderer. Usually following the smell of fresh bread.",
    },
    time: "4 hours ago",
    images: [
      {
        src: "/images/bakery.jpg",
        width: 1400,
        height: 1042,
        alt: "Warm neighbourhood bakery with fresh bread on display",
      },
      {
        src: "/images/croissant.jpg",
        width: 1200,
        height: 960,
        alt: "Golden croissants, with flaky layers and a dusting of flour",
      },
    ],
    caption:
      "Followed the smell of warm bread and found a new Saturday ritual. Took a different route on my morning walk and followed the smell of bread. A tiny counter, still-warm loaves, and the loveliest chat about sourdough. Went in for one loaf. Left with a pastry for the walk home, too.",
    location: "A neighbourhood bakery · London",
    likes: 86,
    comments: [
      {
        id: "bakery-1",
        author: "Sophie M.",
        initials: "SM",
        text: "A warm loaf on the way home is such a small, lovely luxury.",
      },
    ],
    publishedAt: "2026-11-20T08:00:00Z",
    category: "Bread",
    tags: ["Bakery", "London"],
  },
  {
    id: "first-loaf",
    title: "My very first loaf",
    kind: "bake",
    author: {
      id: "noor",
      name: "Noor K.",
      initials: "NK",
      bio: "A beginner baker, making room for the happy accidents.",
    },
    time: "Yesterday",
    images: [
      {
        src: "/images/bread.jpg",
        width: 1600,
        height: 1064,
        alt: "Rustic homemade loaves with flour-dusted golden crusts",
      },
    ],
    caption:
      "A little darker than planned, and I definitely got flour on the cat. But it crackles when it cools and makes excellent toast. First loaf: calling that a win.",
    likes: 37,
    comments: [
      {
        id: "loaf-1",
        author: "Sophie M.",
        initials: "SM",
        text: "That crust! Butter and a cup of tea and you’re all set.",
      },
    ],
    publishedAt: "2026-11-19T14:00:00Z",
    category: "Bread",
  },
  {
    id: "rainy-day",
    kind: "general",
    author: {
      id: "sophie",
      name: "Sophie M.",
      initials: "SM",
      bio: "Learning one bake at a time. Big believer in a second cup of coffee.",
    },
    time: "12 minutes ago",
    publishedAt: "2026-11-20T11:48:00Z",
    caption:
      "Anyone else feel like baking something when it starts raining? It’s becoming a problem.",
    likes: 24,
    comments: [
      {
        id: "rain-1",
        author: "Noor K.",
        initials: "NK",
        text: "Rain on the window, something warm in the oven. There are worse habits!",
      },
    ],
  },
  {
    id: "kitchen-sunshine",
    kind: "general",
    author: {
      id: "noor",
      name: "Noor K.",
      initials: "NK",
      bio: "A beginner baker, making room for the happy accidents.",
    },
    time: "1 hour ago",
    publishedAt: "2026-11-20T11:00:00Z",
    caption:
      "A sunny patch on the kitchen counter and suddenly I’m eight again, waiting for a taste of Grandma’s icing. Funny how a little thing brings it all back.",
    images: [
      {
        src: "/images/cake.jpg",
        width: 1200,
        height: 804,
        alt: "Homemade vanilla cupcakes with icing and colourful sprinkles",
      },
      {
        src: "/images/bread.jpg",
        width: 1600,
        height: 1064,
        alt: "Rustic homemade loaves with flour-dusted golden crusts",
      },
    ],
    likes: 42,
    comments: [],
  },
  {
    id: "cookie-afternoon",
    title: "Cookies for the neighbours",
    kind: "bake",
    author: {
      id: "amelia",
      name: "Amelia R.",
      initials: "AR",
      bio: "Family recipes, generous sprinkles, and something sweet for the neighbours.",
    },
    time: "3 hours ago",
    publishedAt: "2026-11-20T09:00:00Z",
    images: [
      {
        src: "/images/cookies.jpg",
        alt: "A batch of golden chocolate chip cookies",
        width: 1200,
        height: 1501,
      },
    ],
    category: "Cookies",
    caption:
      "Made a batch for the neighbours. Ate the wonkiest two while they were still warm. Quality control is important.",
    recipeId: "chocolate-chip-cookies",
    likes: 59,
    comments: [],
  },
];
export const recipes: Recipe[] = [
  {
    id: "lemon-cake",
    title: "Mum’s vanilla cupcakes",
    description:
      "The vanilla cupcakes that never make it to Monday. A family favourite, now yours too. These are the cupcakes my mum made for every birthday. Nothing fancy: soft vanilla sponge, a generous swirl of buttercream, and far too many sprinkles. The trick is letting the butter soften properly and stopping the mixer as soon as the flour disappears. Let them cool completely before icing — I’ve learned that one the messy way.",
    author: {
      id: "amelia",
      name: "Amelia R.",
      initials: "AR",
      bio: "Family recipes, generous sprinkles, and something sweet for the neighbours.",
    },
    time: "Yesterday",
    cover: {
      src: "/images/cake.jpg",
      width: 1200,
      height: 804,
      alt: "Homemade vanilla cupcakes with icing and colourful sprinkles",
    },
    prep: "20 min",
    bake: "18–22 min",
    yield: "12 cupcakes",
    ingredients: [
      "125 g unsalted butter, softened",
      "125 g caster sugar",
      "2 medium eggs",
      "125 g self-raising flour",
      "2 tbsp milk",
      "1 tsp vanilla extract",
      "For the icing: 150 g softened butter, 300 g icing sugar, 1 tbsp milk",
      "Sprinkles, for finishing",
    ],
    steps: [
      "Heat the oven to 180°C (160°C fan). Line a 12-hole muffin tin with paper cases.",
      "Beat the butter and sugar until pale and fluffy. Beat in the eggs one at a time, then the vanilla.",
      "Gently fold in the flour and milk. Divide between the cases, filling each about two-thirds full.",
      "Bake for 18–22 minutes, until golden and a skewer comes out clean. Transfer to a rack and cool completely.",
      "Beat the icing butter until smooth. Gradually add the icing sugar and milk, then beat until fluffy. Swirl onto the cooled cakes and finish with sprinkles.",
    ],
    note: "Contains wheat, eggs and milk. Check the ingredients you use for allergens.",
    likes: 204,
    comments: [
      {
        id: "cake-1",
        author: "James L.",
        initials: "JL",
        text: "Made these for a picnic. Not a single one came home.",
      },
    ],
    publishedAt: "2026-11-19T10:00:00Z",
    category: "Cupcakes",
  },
  {
    id: "cinnamon-buns",
    title: "Slow Sunday cinnamon buns",
    description:
      "Soft, cardamom-scented dough, a generous cinnamon swirl and a little pearl sugar. A slow afternoon well spent. Leave plenty of time for the dough to rise.",
    author: {
      id: "sophie",
      name: "Sophie M.",
      initials: "SM",
      bio: "Learning one bake at a time. Big believer in a second cup of coffee.",
    },
    time: "This week",
    cover: {
      src: "/images/buns.jpg",
      width: 1200,
      height: 1600,
      alt: "Cinnamon buns with a swirl of cinnamon and pearl sugar",
    },
    additionalImages: [
      {
        src: "/images/buns-proofing.jpg",
        width: 1200,
        height: 1559,
        alt: "Cinnamon buns rising in a baking tray",
      },
    ],
    prep: "35 min + 2 hr rising",
    bake: "20–25 min",
    yield: "12 buns",
    ingredients: [
      "500 g strong white bread flour",
      "7 g instant dried yeast",
      "75 g caster sugar",
      "1 tsp ground cardamom",
      "1 tsp fine salt",
      "250 ml lukewarm whole milk",
      "1 medium egg",
      "75 g unsalted butter, softened",
      "For the filling: 75 g softened butter, 100 g soft brown sugar, 2 tbsp ground cinnamon",
      "1 beaten egg and 2 tbsp pearl sugar, to finish",
    ],
    steps: [
      "Combine the flour, yeast, sugar, cardamom and salt. Add the lukewarm milk and egg, then mix into a dough.",
      "Knead in the softened butter a little at a time. Continue kneading until smooth and elastic, about 10 minutes.",
      "Cover and leave in a warm spot for about 1 hour, or until doubled in size.",
      "Mix the filling ingredients. Roll the dough into a rectangle about 40 × 30 cm and spread the filling evenly over it.",
      "Roll up from the long edge and slice into 12 buns. Place, spaced apart, on a lined baking tray. Cover and leave for about 1 hour, until puffy.",
      "Heat the oven to 200°C (180°C fan). Brush the buns with beaten egg and scatter with pearl sugar. Bake for 20–25 minutes, until golden and cooked through. Cool on a rack.",
    ],
    note: "Contains wheat, milk and eggs. Rising times vary with the temperature of your kitchen.",
    likes: 64,
    comments: [],
    publishedAt: "2026-11-17T10:00:00Z",
    category: "Pastries",
  },
  {
    id: "chocolate-chip-cookies",
    title: "Soft-centred chocolate chip cookies",
    description:
      "Crisp edges, soft middles, and a generous handful of chocolate. A little chilling time makes all the difference.",
    author: {
      id: "amelia",
      name: "Amelia R.",
      initials: "AR",
      bio: "Family recipes, generous sprinkles, and something sweet for the neighbours.",
    },
    time: "Yesterday",
    publishedAt: "2026-11-19T12:00:00Z",
    category: "Cookies",
    cover: {
      src: "/images/cookies.jpg",
      alt: "A batch of golden chocolate chip cookies",
      width: 1200,
      height: 1501,
    },
    prep: "20 min + 30 min chilling",
    bake: "10–12 min",
    yield: "16 cookies",
    ingredients: [
      "125 g unsalted butter, softened",
      "100 g light brown sugar",
      "75 g caster sugar",
      "1 medium egg",
      "1 tsp vanilla extract",
      "225 g plain flour",
      "1/2 tsp bicarbonate of soda",
      "1/2 tsp fine salt",
      "200 g chopped chocolate",
    ],
    steps: [
      "Beat the butter and both sugars until creamy, then beat in the egg and vanilla.",
      "Fold in the flour, bicarbonate of soda and salt until just combined. Fold through the chocolate.",
      "Chill the dough for 30 minutes. Heat the oven to 180°C (160°C fan) and line two baking trays.",
      "Scoop into 16 portions, leaving space between them. Bake for 10–12 minutes, until the edges are golden and the centres still look a little soft.",
      "Leave on the trays for 10 minutes, then move to a rack to cool.",
    ],
    note: "Contains wheat, milk and eggs. Check your chocolate for additional allergens.",
    likes: 93,
    comments: [],
  },
];
export const feedItems: FeedItem[] = [
  ...socialPosts.map((post): FeedItem => ({ kind: "post", postId: post.id })),
  ...recipes.map((recipe): FeedItem => ({
    kind: "recipe",
    recipeId: recipe.id,
  })),
];

export function getPost(id: string) {
  return socialPosts.find((post) => post.id === id);
}
export function getRecipe(id: string) {
  return recipes.find((recipe) => recipe.id === id);
}
export function postLabel(post: Post) {
  return (
    post.author.name +
    "’s " +
    (post.kind === "bake"
      ? "bake"
      : post.kind === "discovery"
        ? "little find"
        : "post")
  );
}
export function postTarget(post: Post): ReactionTarget {
  return {
    id: post.id,
    label: postLabel(post),
    href: "/posts/" + post.id,
    likes: post.likes,
    comments: post.comments,
  };
}
export function recipeTarget(recipe: Recipe): ReactionTarget {
  return {
    id: recipe.id,
    label: recipe.title,
    href: "/recipes/" + recipe.id,
    likes: recipe.likes,
    comments: recipe.comments,
  };
}
export function resolveFeedItem(item: FeedItem) {
  return item.kind === "post" ? getPost(item.postId) : getRecipe(item.recipeId);
}
