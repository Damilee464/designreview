import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "./index";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — DesignReview" },
      { name: "description", content: "Sign in or create your DesignReview account." },
      { property: "og:title", content: "Sign in — DesignReview" },
      { property: "og:description", content: "Access your design review workspace." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up" | "verify">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => {
      if (s) navigate({ to: "/dashboard", replace: true });
    });
    return () => data.subscription.unsubscribe();
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "up") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth`, data: { full_name: name } },
        });
        if (error) throw error;
        if (data.user && !data.session) {
          // Email confirmation required — show success state
          setMode("verify");
        } else if (data.session) {
          navigate({ to: "/dashboard", replace: true });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-grid px-4">
      <div className="w-full max-w-sm">
        {/* Back to home */}
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" /> Back to home
        </Link>
        <div className="rounded-2xl border border-border bg-white dark:bg-card p-8 shadow-xl">
          <Logo />

          {/* Email verification sent screen */}
          {mode === "verify" ? (
            <div className="mt-8 text-center">
              <div className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-primary/10">
                <svg className="size-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0L12 13.5 2.25 6.75" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold">Check your email</h1>
              <p className="mt-3 text-sm text-muted-foreground">
                We sent a confirmation link to <span className="font-medium text-foreground">{email}</span>. Click it to activate your account, then come back to sign in.
              </p>
              <p className="mt-2 text-xs text-muted-foreground">Didn't get it? Check your spam folder.</p>
              <Button
                className="mt-6 w-full"
                variant="outline"
                onClick={() => setMode("in")}
              >
                Back to sign in
              </Button>
            </div>
          ) : (
            <>
              <h1 className="mt-8 text-2xl font-bold">{mode === "in" ? "Welcome back" : "Create your account"}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {mode === "in" ? "Sign in to your review workspace." : "New accounts start as designers."}
              </p>
              <form onSubmit={submit} className="mt-6 space-y-4">
                {mode === "up" && (
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Full name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                )}
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full" disabled={busy}>
                  {mode === "in" ? "Sign in" : "Create account"}
                </Button>
              </form>
              <button
                className="mt-5 w-full text-center text-sm text-muted-foreground hover:text-foreground"
                onClick={() => setMode(mode === "in" ? "up" : "in")}
              >
                {mode === "in" ? "No account? Sign up" : "Have an account? Sign in"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
