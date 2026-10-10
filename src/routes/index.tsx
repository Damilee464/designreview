import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { ArrowRight, ChevronLeft, ChevronRight, GitBranch, LayoutGrid, MessageSquareDot, ShieldCheck, Star, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DesignReview — Submit, review and approve UI designs" },
      { name: "description", content: "One place for designers to submit work, reviewers to pin feedback, and teams to track every version to approval." },
      { property: "og:title", content: "DesignReview — Submit, review and approve UI designs" },
      { property: "og:description", content: "Pinned feedback, version history and approvals for UI/UX teams." },
    ],
  }),
  component: Landing,
});

// High-quality Unsplash images — UI/design/workspace theme
const SHOWCASE_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=900&q=80&auto=format&fit=crop",
    label: "Design systems",
  },
  {
    url: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=900&q=80&auto=format&fit=crop",
    label: "UI prototyping",
  },
  {
    url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=900&q=80&auto=format&fit=crop",
    label: "Collaborative review",
  },
  {
    url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=900&q=80&auto=format&fit=crop",
    label: "Team approvals",
  },
  {
    url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900&q=80&auto=format&fit=crop",
    label: "Creative workflow",
  },
];

const STATS = [
  { value: "3×", label: "Faster approvals" },
  { value: "100%", label: "Version history" },
  { value: "0", label: "Lost feedback" },
];

function ImageCarousel() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => advance(1), 4500);
    return () => clearInterval(timer);
  }, [current]);

  function advance(dir: 1 | -1) {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent((c) => (c + dir + SHOWCASE_IMAGES.length) % SHOWCASE_IMAGES.length);
      setAnimating(false);
    }, 300);
  }

  const img = SHOWCASE_IMAGES[current];

  return (
    <div className="group relative overflow-hidden rounded-2xl shadow-2xl">
      {/* Image */}
      <div
        className={`transition-opacity duration-300 ${animating ? "opacity-0" : "opacity-100"}`}
      >
        <img
          src={img.url}
          alt={img.label}
          className="aspect-[4/3] w-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

      {/* Pin overlays — decorative */}
      <span className="absolute left-[22%] top-[20%] grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full rounded-bl-none bg-primary text-xs font-bold text-white shadow-lg">1</span>
      <span className="absolute left-[68%] top-[48%] grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full rounded-bl-none bg-primary text-xs font-bold text-white shadow-lg">2</span>
      <span className="absolute left-[40%] top-[75%] grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full rounded-bl-none bg-primary text-xs font-bold text-white shadow-lg">3</span>

      {/* Label bottom */}
      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {img.label}
        </span>
        <div className="flex gap-1">
          {SHOWCASE_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => { setAnimating(true); setTimeout(() => { setCurrent(i); setAnimating(false); }, 300); }}
              className={`h-1.5 rounded-full transition-all ${i === current ? "w-6 bg-white" : "w-1.5 bg-white/40"}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Arrow controls — always visible on mobile, hover on desktop */}
      <button
        onClick={() => advance(-1)}
        className="absolute left-3 top-1/2 -translate-y-1/2 grid size-8 place-items-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-opacity sm:opacity-0 sm:group-hover:opacity-100 hover:bg-black/50"
        aria-label="Previous"
      >
        <ChevronLeft className="size-4" />
      </button>
      <button
        onClick={() => advance(1)}
        className="absolute right-3 top-1/2 -translate-y-1/2 grid size-8 place-items-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-opacity sm:opacity-0 sm:group-hover:opacity-100 hover:bg-black/50"
        aria-label="Next"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}

function Landing() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(!!data.session);
    });
  }, []);

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/60 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo />
          <div className="flex items-center gap-2">
            <DarkModeToggle />
            {loggedIn ? (
              <Button asChild size="sm">
                <Link to="/dashboard"><LayoutGrid className="size-3.5" /> Dashboard</Link>
              </Button>
            ) : (
              <Button asChild size="sm">
                <Link to="/auth">Sign in</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-4 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-16">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr]">
            {/* Left copy */}
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3 py-1.5 text-xs font-medium text-primary">
                <Zap className="size-3" />
                Design review & approval platform
              </div>
              <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
                Feedback that lands{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 text-primary">exactly</span>
                  <span className="absolute -bottom-1 left-0 right-0 h-3 rounded-full bg-primary/15" />
                </span>{" "}
                where it matters.
              </h1>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
                Designers submit. Reviewers drop numbered pins right on the screen. Every version, comment and approval is kept on record — forever.
              </p>

              {/* Stats row */}
              <div className="mt-8 flex gap-6">
                {STATS.map((s) => (
                  <div key={s.label}>
                    <div className="font-display text-2xl font-bold text-primary">{s.value}</div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-xl px-6">
                  <Link to="/auth">
                    Sign in <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>

              {/* Social proof */}
              <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex -space-x-2">
                  {["bg-orange-400","bg-blue-400","bg-emerald-400","bg-violet-400"].map((c, i) => (
                    <span key={i} className={`grid size-7 place-items-center rounded-full border-2 border-background ${c} text-[10px] font-bold text-white`}>
                      {["A","R","D","T"][i]}
                    </span>
                  ))}
                </div>
                <span>Trusted by design teams worldwide</span>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => <Star key={i} className="size-3 fill-current" />)}
                </div>
              </div>
            </div>

            {/* Right — image carousel */}
            <ImageCarousel />
          </div>
        </section>

        {/* Feature strip */}
        <section className="border-y border-border/60 bg-muted/30">
          <div className="mx-auto max-w-6xl px-6 py-14">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold">Everything your team needs</h2>
              <p className="mt-2 text-muted-foreground">No more endless email threads or lost Slack messages.</p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {[
                {
                  icon: MessageSquareDot,
                  t: "Pinned comments",
                  d: "Click anywhere on a design to attach a numbered note. Everyone sees exactly what you mean.",
                  color: "bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400",
                },
                {
                  icon: GitBranch,
                  t: "Version history",
                  d: "V1, V2, V3 — each resubmission is tracked. Compare changes across every iteration.",
                  color: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
                },
                {
                  icon: ShieldCheck,
                  t: "Clear approvals",
                  d: "See who approved what, and when, at a glance. Full audit trail, always.",
                  color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
                },
              ].map((f) => (
                <div key={f.t} className="group rounded-2xl border bg-card p-7 shadow-card transition-shadow hover:shadow-lg">
                  <div className={`inline-flex rounded-xl p-3 ${f.color}`}>
                    <f.icon className="size-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{f.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">How it works</h2>
            <p className="mt-2 text-muted-foreground">Three roles, one smooth workflow.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { step: "01", role: "Designer", action: "Submits a design", detail: "Upload an image, PDF or paste a Figma link. Add context for reviewers." },
              { step: "02", role: "Reviewer", action: "Pins feedback", detail: "Click directly on the design to leave numbered, threaded comments." },
              { step: "03", role: "Admin", action: "Approves or requests changes", detail: "One-click approval with a full timestamp and audit history." },
            ].map((s) => (
              <div key={s.step} className="relative rounded-2xl border bg-card p-7 shadow-card">
                <div className="font-display text-4xl font-bold text-primary/20">{s.step}</div>
                <div className="mt-3 text-xs font-semibold uppercase tracking-widest text-primary">{s.role}</div>
                <h3 className="mt-1 text-lg font-semibold">{s.action}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA banner */}
        <section className="mx-auto max-w-6xl px-6 pb-20">
          <div className="relative overflow-hidden rounded-3xl bg-primary px-10 py-14 text-center text-primary-foreground shadow-2xl">
            {/* Background blobs */}
            <div className="absolute -right-16 -top-16 size-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 size-64 rounded-full bg-white/10 blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl font-bold md:text-4xl">Ready to close the feedback loop?</h2>
              <p className="mx-auto mt-4 max-w-md text-primary-foreground/80">
                Set up in minutes. Your first design review is waiting.
              </p>
              <Button asChild size="lg" className="mt-8 rounded-xl bg-white px-8 text-primary hover:bg-white/90">
                <Link to="/auth">
                  Create your account <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-muted/20 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 text-sm text-muted-foreground">
          <Logo />
          <span>Design review made simple.</span>
        </div>
      </footer>
    </div>
  );
}

export function Logo() {
  return (
    <div className="flex items-center gap-2 font-display text-lg font-bold">
      <span className="grid size-7 place-items-center rounded-md bg-primary text-sm text-primary-foreground">D</span>
      DesignReview
    </div>
  );
}
