import Link from "next/link";
import {
  Wheat,
  Sparkles,
  Heart,
  ChefHat,
  MapPin,
  Instagram,
} from "lucide-react";
import { Brand } from "@/components/brand";
import { CommunityTaste } from "@/components/community-taste";
import { LandingMotion } from "@/components/landing-motion";

export default function Landing() {
  return (
    <>
      <LandingMotion />
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header className="public-header wrap">
        <Brand />
        <nav aria-label="Main navigation">
          <Link href="/explore">Explore</Link>
          <a href="#about">About</a>
          <Link className="button small" href="/join">
            Join the club
          </Link>
        </nav>
      </header>
      <main id="main">
        <section className="hero wrap">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="tiny-line" /> FOR THE LOVE OF ALL THINGS BAKED
            </p>
            <h1>
              Life’s a little
              <br />
              sweeter with
              <br />
              <em>crumbs.</em>
              <span className="hero-spark" aria-hidden="true">
                ✳
              </span>
            </h1>
            <p className="hero-description">
              A cosy corner for the things we bake, the treats we discover, and
              the people who love them.
            </p>
            <div className="hero-actions">
              <Link className="button" href="/explore">
                Explore the club
              </Link>
              <Link className="text-link" href="/join">
                Join Crumb Club
              </Link>
            </div>
            <div className="hero-note">
              <Heart size={16} strokeWidth={1.5} />
              <span>Good bakes. Good finds. Your kind of people.</span>
            </div>
          </div>
          <div className="hero-art">
            <div className="hero-image">
              <img
                src="/images/buns.jpg"
                alt="Golden homemade cinnamon buns scattered with pearl sugar"
                fetchPriority="high"
              />
              <span className="photo-caption">
                A little messy. A lot to love.
              </span>
            </div>
            <div className="round-stamp" aria-label="Made to be shared">
              <Wheat size={25} strokeWidth={1.2} />
              <span>
                MADE TO
                <br />
                BE SHARED
              </span>
            </div>
            <span className="handwritten">
              there’s always room
              <br />
              for one more.
            </span>
          </div>
        </section>
        <div className="ribbon" aria-hidden="true">
          <span>Made with love</span>
          <Wheat />
          <span>Best shared</span>
          <Wheat />
          <span>A little flour, a little joy</span>
          <Wheat />
          <span>Everyone’s welcome</span>
          <Wheat />
          <span>Made with love</span>
        </div>
        <section id="about" className="intro wrap" data-reveal>
          <div>
            <p className="eyebrow">PULL UP A CHAIR</p>
            <h2>
              Not just the perfect bake.
              <br />
              <em>The joy around it.</em>
            </h2>
          </div>
          <div className="intro-copy">
            <p>
              The first loaf. The slightly wonky cake. That little bakery you
              can’t stop thinking about.
            </p>
            <p>
              Crumb Club is a place for all of it. A community of home bakers,
              pastry seekers and “just one more bite” people. No perfect piping
              required.
            </p>
            <span className="handwritten">Just bring your appetite.</span>
          </div>
        </section>
        <section className="world wrap">
          <div className="section-heading" data-reveal>
            <div>
              <p className="eyebrow">FOLLOW YOUR CRAVINGS</p>
              <h2>
                A whole world of <em>good things.</em>
              </h2>
            </div>
            <Sparkles size={33} strokeWidth={1.2} />
          </div>
          <div className="world-grid">
            <Link
              href="/explore?category=recipes"
              className="world-item bake"
              data-reveal
            >
              <div className="world-photo">
                <img
                  src="/images/bread.jpg"
                  alt="Rustic artisan bread with a crisp golden crust"
                  loading="lazy"
                />
                <span className="image-label">
                  <ChefHat size={17} /> FLOUR-DUSTED POSSIBILITIES
                </span>
              </div>
              <h3>Bake something.</h3>
              <p>
                A recipe to fall in love with. A new thing to try.
                <br />A very good reason to preheat the oven.
              </p>
            </Link>
            <Link
              href="/explore?category=bakeries"
              className="world-item discover"
              data-reveal
            >
              <div className="world-photo">
                <img
                  src="/images/croissant.jpg"
                  alt="Buttery golden croissants at a local bakery"
                  loading="lazy"
                />
                <span className="image-label">
                  <MapPin size={17} /> LITTLE FINDS, BIG FEELINGS
                </span>
              </div>
              <h3>Discover something.</h3>
              <p>
                Hidden bakeries, perfect pastries, and the places
                <br />
                worth taking the long way for.
              </p>
            </Link>
            <Link href="/create" className="world-item share" data-reveal>
              <div className="share-illustration">
                <Heart size={34} strokeWidth={1} />
                <p>
                  “It didn’t rise.
                  <br />
                  We ate it
                  <br />
                  <em>anyway.”</em>
                </p>
                <span>— a perfectly good baking story</span>
              </div>
              <h3>Share something.</h3>
              <p>
                The proud moments. The happy accidents.
                <br />
                It all belongs at the table.
              </p>
            </Link>
          </div>
        </section>
        <section className="community">
          <div className="wrap">
            <div className="section-heading" data-reveal>
              <div>
                <p className="eyebrow">A TASTE OF THE CLUB</p>
                <h2>
                  Fresh from <em>the community.</em>
                </h2>
              </div>
              <Link className="text-link" href="/app">
                Come have a look
              </Link>
            </div>
            <p className="preview-note">
              A few stories you might find here. Sample posts from our prototype
              community.
            </p>
            <CommunityTaste />
          </div>
        </section>
        <section className="invitation wrap" data-reveal>
          <div className="invitation-icon">
            <Wheat size={58} strokeWidth={1} />
          </div>
          <p className="eyebrow">THERE’S A PLACE FOR YOU HERE</p>
          <h2>
            However you crumb,
            <br />
            <em>you’re one of us.</em>
          </h2>
          <p>
            For the bakers, the tasters, the recipe savers.
            <br />
            Let’s make something lovely together.
          </p>
          <Link className="button" href="/join">
            Find your people
          </Link>
          <span className="invitation-flour" aria-hidden="true">
            ✳
          </span>
        </section>
      </main>
      <footer className="footer wrap">
        <Brand />
        <p>A little corner of the internet. A whole lot of heart.</p>
        <div>
          <a href="#about">About the club</a>
          <a href="https://www.instagram.com/" aria-label="Instagram">
            <Instagram size={19} />
          </a>
          <span>© {new Date().getFullYear()} Crumb Club</span>
        </div>
      </footer>
    </>
  );
}
