"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChefHat, Heart, Wheat, Check, ChevronLeft } from "lucide-react";
import { Brand } from "@/components/brand";
import {
  useDemo,
  interests,
  type DemoPreferences,
  type DemoRole,
  type Interest,
} from "./demo-provider";
const roles = [
  {
    value: "baker",
    label: "I love baking",
    description: "Flour on the counter, something in the oven.",
    Icon: ChefHat,
  },
  {
    value: "lover",
    label: "I love baked goods",
    description: "Always on the lookout for my next favourite.",
    Icon: Heart,
  },
  {
    value: "both",
    label: "A bit of both",
    description: "Just as happy baking as taking the first bite.",
    Icon: Wheat,
  },
] as const;
function OnboardingForm({ initial }: { initial: DemoPreferences | null }) {
  const router = useRouter();
  const { savePreferences, storageError } = useDemo();
  const [step, setStep] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (step > 0) heading.current?.focus();
  }, [step]);
  const [name, setName] = useState(initial?.name ?? "");
  const [role, setRole] = useState<DemoRole | null>(initial?.role ?? null);
  const [selected, setSelected] = useState<Interest[]>(
    initial?.interests ?? [],
  );
  function finish() {
    if (!role || !selected.length) return;
    savePreferences({
      name: name.trim().slice(0, 30),
      role,
      interests: selected,
    });
    router.push("/app");
  }
  return (
    <div className="onboarding">
      <header className="join-header">
        <Brand />
        <Link href="/explore">Just exploring?</Link>
      </header>
      <main className="join-main">
        <div className="join-art">
          <img
            src="/images/cake.jpg"
            alt="Vanilla cupcakes topped with colourful sprinkles"
          />
          <div>
            <Wheat size={35} />
            <p>
              There’s always
              <br />
              room for <em>one more.</em>
            </p>
          </div>
        </div>
        <section className="join-content">
          <p className="demo-label">FRONTEND DEMO · NO ACCOUNT NEEDED</p>
          <div className="join-progress" aria-label={`Step ${step + 1} of 3`}>
            {[0, 1, 2].map((value) => (
              <span key={value} className={value <= step ? "complete" : ""} />
            ))}
          </div>
          <p className="eyebrow">
            {
              [
                "PULL UP A CHAIR",
                "FIND YOUR KIND OF COSY",
                "A FEW OF YOUR FAVOURITES",
              ][step]
            }
          </p>
          <h1 ref={heading} tabIndex={-1}>
            {
              [
                "Welcome to the club.",
                "What brings you here?",
                "What do you love?",
              ][step]
            }
          </h1>
          <p className="join-description">
            {
              [
                "A little corner for the things we bake and the treats we find. Let’s make it feel like you.",
                "A baker, a pastry seeker, or somewhere in between. There’s a place for you here.",
                "Pick one or more interests. They’ll help you find categories you enjoy. You can change them any time.",
              ][step]
            }
          </p>
          {step === 0 ? (
            <div className="join-name">
              <label htmlFor="demo-name">
                What should we call you? <span>(optional)</span>
              </label>
              <input
                id="demo-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={30}
                autoComplete="given-name"
                placeholder="Your first name"
              />
              <p>
                This is a demo, with sample community stories. Your preferences
                and activity stay in this browser. No sign-in or password.
              </p>
            </div>
          ) : step === 1 ? (
            <fieldset className="role-options">
              <legend className="sr-only">Choose your baking vibe</legend>
              {roles.map(({ value, label, description, Icon }) => (
                <label key={value} className={role === value ? "selected" : ""}>
                  <input
                    type="radio"
                    name="vibe"
                    value={value}
                    checked={role === value}
                    onChange={() => setRole(value)}
                  />
                  <Icon size={25} strokeWidth={1.4} />
                  <span>
                    <strong>{label}</strong>
                    <small>{description}</small>
                  </span>
                  <span className="role-check">
                    {role === value && <Check size={15} />}
                  </span>
                </label>
              ))}
            </fieldset>
          ) : (
            <fieldset className="interest-options">
              <legend className="sr-only">Choose at least one interest</legend>
              {interests.map((interest) => (
                <label
                  key={interest}
                  className={selected.includes(interest) ? "selected" : ""}
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(interest)}
                    onChange={() =>
                      setSelected((current) =>
                        current.includes(interest)
                          ? current.filter((value) => value !== interest)
                          : [...current, interest],
                      )
                    }
                  />
                  <span>{interest}</span>
                  {selected.includes(interest) && <Check size={16} />}
                </label>
              ))}
            </fieldset>
          )}
          <div className="join-actions">
            {step > 0 && (
              <button className="join-back" onClick={() => setStep(step - 1)}>
                <ChevronLeft size={17} /> Back
              </button>
            )}
            <button
              className="button"
              disabled={
                (step === 1 && !role) || (step === 2 && !selected.length)
              }
              onClick={() => (step < 2 ? setStep(step + 1) : finish())}
            >
              {step === 0
                ? "Enter demo mode"
                : step === 1
                  ? "Continue"
                  : "Make yourself at home"}
            </button>
          </div>
          {storageError && (
            <p className="join-storage" role="status">
              Browser storage is unavailable. You can still try the demo;
              preferences will last for this visit.
            </p>
          )}
          <Link href="/explore" className="join-skip">
            Browse the club without setting up
          </Link>
        </section>
      </main>
      <footer className="join-footer">
        Good bakes. Good finds. Your kind of people.
      </footer>
    </div>
  );
}
export function Onboarding() {
  const { ready, preferences } = useDemo();
  return ready ? (
    <OnboardingForm initial={preferences} />
  ) : (
    <div className="join-loading" role="status">
      Making a little room for you…
    </div>
  );
}
