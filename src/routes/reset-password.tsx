import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [
    { title: "Choose a new password — IdomaConnect AI" },
    { name: "description", content: "Choose a new password for IdomaConnect AI." },
    { property: "og:title", content: "Choose a new password — IdomaConnect AI" },
    { property: "og:description", content: "Complete secure account recovery." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }), component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const [valid, setValid] = useState(false); const [password, setPassword] = useState(""); const [message, setMessage] = useState("Checking your reset link…"); const [busy, setBusy] = useState(false);
  useEffect(() => {
    const recovery = new URLSearchParams(window.location.hash.slice(1)).get("type") === "recovery";
    if (recovery) { setValid(true); setMessage(""); }
    const { data } = supabase.auth.onAuthStateChange((event) => { if (event === "PASSWORD_RECOVERY") { setValid(true); setMessage(""); } });
    return () => data.subscription.unsubscribe();
  }, []);
  async function submit(event: FormEvent) { event.preventDefault(); setBusy(true); const { error } = await supabase.auth.updateUser({ password }); setBusy(false); setMessage(error ? error.message : "Password changed. You can now return to the admin area."); }
  return <div className="mx-auto max-w-md px-4 py-20"><p className="text-xs uppercase tracking-widest text-terracotta">Account recovery</p><h1 className="mt-2 text-3xl">Choose a new password</h1>{!valid ? <p className="mt-5 text-sm text-muted-foreground">{message}</p> : <form onSubmit={submit} className="mt-8 space-y-4"><div className="space-y-2"><Label htmlFor="password">New password</Label><Input id="password" type="password" minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} /></div>{message && <p role="status" className="text-sm text-muted-foreground">{message}</p>}<Button className="w-full" disabled={busy}>Save new password</Button></form>}<Link to="/auth" className="mt-5 block text-center text-sm text-primary hover:underline">Return to sign in</Link></div>;
}