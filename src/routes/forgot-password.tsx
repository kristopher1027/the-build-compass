import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [
    { title: "Reset password — IdomaConnect AI" },
    { name: "description", content: "Request a secure password reset for IdomaConnect AI." },
    { property: "og:title", content: "Reset password — IdomaConnect AI" },
    { property: "og:description", content: "Request secure account recovery." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }), component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState(""); const [message, setMessage] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent) { event.preventDefault(); setBusy(true); const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + "/reset-password" }); setBusy(false); setMessage(error ? error.message : "Check your email for the password reset link."); }
  return <div className="mx-auto max-w-md px-4 py-20"><p className="text-xs uppercase tracking-widest text-terracotta">Account recovery</p><h1 className="mt-2 text-3xl">Reset your password</h1><p className="mt-3 text-sm text-muted-foreground">We will send a secure reset link to your email.</p><form onSubmit={submit} className="mt-8 space-y-4"><div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>{message && <p role="status" className="text-sm text-muted-foreground">{message}</p>}<Button className="w-full" disabled={busy}>Send reset link</Button></form><Link to="/auth" className="mt-5 block text-center text-sm text-primary hover:underline">Back to sign in</Link></div>;
}