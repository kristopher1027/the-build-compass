import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowLeft, BookOpen, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [
    { title: "Admin sign in — IdomaConnect AI" },
    { name: "description", content: "Sign in to manage the IdomaConnect AI knowledge library." },
    { property: "og:title", content: "Admin sign in — IdomaConnect AI" },
    { property: "og:description", content: "Secure access to the IdomaConnect AI knowledge library." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      if (mode === "signup") {
        const result = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName.trim() },
            emailRedirectTo: window.location.origin + "/auth",
          },
        });
        if (result.error) {
          setError(result.error.message);
          return;
        }
        if (!result.data.session) {
          setMessage("Check your email and confirm your address. Then return here to sign in.");
          return;
        }
      } else {
        const result = await supabase.auth.signInWithPassword({ email, password });
        if (result.error) {
          setError(result.error.message);
          return;
        }
      }

      await navigate({ to: "/admin", replace: true });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to sign in. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] grid lg:grid-cols-[0.85fr_1.15fr]">
      <section className="bg-primary text-primary-foreground px-6 py-12 sm:px-12 lg:px-16 flex flex-col justify-between">
        <Link to="/" className="inline-flex items-center gap-2 text-sm opacity-80 hover:opacity-100"><ArrowLeft /> Back to Ai wa</Link>
        <div className="max-w-md py-16">
          <BookOpen className="h-9 w-9 text-gold" />
          <p className="mt-7 text-xs uppercase tracking-widest text-gold">Keeper's entrance</p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl leading-tight">Keep our words in our own hands.</h1>
          <p className="mt-5 text-sm leading-relaxed opacity-80">Add what our elders teach us, correct what needs care, and keep every published entry ready for the community and our AI.</p>
        </div>
        <p className="text-xs opacity-60">The first confirmed account becomes the administrator.</p>
      </section>
      <section className="px-5 py-12 sm:px-12 lg:px-20 flex items-center">
        <form onSubmit={submit} className="w-full max-w-md mx-auto space-y-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-terracotta">{mode === "signin" ? "Welcome back" : "Create the first account"}</p>
            <h2 className="mt-2 text-3xl">{mode === "signin" ? "Enter the library" : "Become its first keeper"}</h2>
          </div>
          {mode === "signup" && <div className="space-y-2"><Label htmlFor="name">Display name</Label><Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required autoComplete="name" /></div>}
          <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" /></div>
          <div className="space-y-2"><Label htmlFor="password">Password</Label><Input id="password" type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete={mode === "signin" ? "current-password" : "new-password"} /></div>
          {error && <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
          {message && <p role="status" className="rounded-md border border-primary/25 bg-primary/10 p-3 text-sm text-primary">{message}</p>}
          <Button className="w-full" size="lg" disabled={busy}>{busy && <Loader2 className="animate-spin" />}{mode === "signin" ? "Sign in" : "Create account"}</Button>
          <div className="flex items-center justify-between gap-3 text-sm">
            <Button type="button" variant="link" className="h-auto p-0" onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); setMessage(""); }}>{mode === "signin" ? "Create an account" : "I already have an account"}</Button>
            {mode === "signin" && <Link to="/forgot-password" className="text-muted-foreground hover:text-foreground">Forgot password?</Link>}
          </div>
        </form>
      </section>
    </div>
  );
}