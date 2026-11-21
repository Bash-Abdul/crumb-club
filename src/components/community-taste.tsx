import Link from "next/link";
import { ArrowUpRight, BookOpen, MapPin, MessageCircle } from "lucide-react";
import { getPost, getRecipe, postTarget, recipeTarget } from "@/data/content";
import { profileHref } from "@/data/bakers";
import type { Author } from "@/features/community/types";
import { PostActions } from "@/features/community/post-actions";

function Baker({ author, detail }: { author: Author; detail: string }) {
  return (
    <Link href={profileHref(author.id)} className="taste-baker">
      <span
        className={`taste-avatar taste-avatar-${author.id}`}
        aria-hidden="true"
      >
        {author.initials}
      </span>
      <span>
        <strong>{author.name}</strong>
        <small>{detail}</small>
      </span>
    </Link>
  );
}

export function CommunityTaste() {
  const bake = getPost("sunday-buns")!;
  const find = getPost("little-bakery")!;
  const conversation = getPost("rainy-day")!;
  const recipe = getRecipe("lemon-cake")!;
  return (
    <div className="taste-grid">
      <article className="taste-post taste-feature" data-reveal>
        <Baker author={bake.author} detail="A little Sunday baking · 2h" />
        <Link
          href={`/posts/${bake.id}`}
          className="taste-photo"
          aria-label="See Sophie’s cinnamon buns"
        >
          <img
            src={bake.images![0].src}
            alt={bake.images![0].alt}
            loading="lazy"
          />
          <span className="taste-photo-note">worth the sticky fingers.</span>
        </Link>
        <div className="taste-body">
          <PostActions target={postTarget(bake)} />
          <p>
            <strong>{bake.author.name}</strong> My first cinnamon buns. A little
            wonky, a lot of cinnamon. Would absolutely make again.
          </p>
          <Link
            className="taste-conversation"
            href={`/posts/${bake.id}#comments`}
          >
            A few crumbs from the conversation <ArrowUpRight size={14} />
          </Link>
        </div>
      </article>
      <article className="taste-post taste-find" data-reveal>
        <Baker author={find.author} detail="Found a little gem · 4h" />
        <Link
          href={`/posts/${find.id}`}
          className="taste-photo"
          aria-label="Visit James’s bakery find"
        >
          <img
            src={find.images![0].src}
            alt={find.images![0].alt}
            loading="lazy"
          />
        </Link>
        <div className="taste-body">
          <p className="taste-location">
            <MapPin size={13} /> A new Saturday ritual
          </p>
          <p>Followed the smell of warm bread. Stayed for a second pastry.</p>
          <PostActions target={postTarget(find)} />
        </div>
      </article>
      <article className="taste-post taste-chat" data-reveal>
        <Baker author={conversation.author} detail="A thought over tea · 12m" />
        <MessageCircle
          className="taste-chat-mark"
          size={28}
          strokeWidth={1.2}
          aria-hidden="true"
        />
        <Link href={`/posts/${conversation.id}`} className="taste-chat-copy">
          Anyone else feel like baking something when it starts raining?
        </Link>
        <p>Asking for me. And my third batch of cookies.</p>
        <div className="taste-chat-bottom">
          <span className="taste-reply">You’re in good company here.</span>
          <PostActions target={postTarget(conversation)} />
        </div>
      </article>
      <article className="taste-post taste-recipe" data-reveal>
        <Link
          href={`/recipes/${recipe.id}`}
          className="taste-photo"
          aria-label={`Open ${recipe.title}`}
        >
          <img src={recipe.cover.src} alt={recipe.cover.alt} loading="lazy" />
        </Link>
        <div className="taste-recipe-content">
          <Baker author={recipe.author} detail="Opened her recipe book" />
          <Link href={`/recipes/${recipe.id}`}>
            <span className="taste-recipe-label">
              <BookOpen size={13} /> One to keep
            </span>
            <h3>{recipe.title}</h3>
          </Link>
          <PostActions target={recipeTarget(recipe)} />
        </div>
      </article>
    </div>
  );
}
