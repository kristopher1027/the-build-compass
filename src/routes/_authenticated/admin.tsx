import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { BookOpen, Edit3, LogOut, Plus, Search, ShieldAlert, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { KNOWLEDGE_CATEGORIES, type KnowledgeCategory } from "@/data/knowledge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type KnowledgeRow = Database["public"]["Tables"]["knowledge_entries"]["Row"];
type EditorState = { id: string; title: string; category: KnowledgeCategory; content: string; tags: string; is_published: boolean };
const EMPTY: EditorState = { id: "", title: "", category: "History", content: "", tags: "", is_published: true };

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [
    { title: "Knowledge admin — IdomaConnect AI" },
    { name: "description", content: "Add, edit, publish, and remove IdomaConnect AI knowledge entries." },
    { property: "og:title", content: "Knowledge admin — IdomaConnect AI" },
    { property: "og:description", content: "Secure stewardship of the IdomaConnect AI knowledge library." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }), component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = Route.useRouteContext();
  const [entries, setEntries] = useState<KnowledgeRow[]>([]);
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [query, setQuery] = useState("");
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [deleting, setDeleting] = useState<KnowledgeRow | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    const [{ data: roles }, { data, error }] = await Promise.all([
      supabase.from("user_roles").select("role").eq("user_id", user.id),
      supabase.from("knowledge_entries").select("*").order("updated_at", { ascending: false }),
    ]);
    const isAdmin = roles?.some((item) => item.role === "admin") ?? false;
    setAllowed(isAdmin);
    if (error) toast.error("The library could not be loaded."); else setEntries(data ?? []);
  }

  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return needle ? entries.filter((entry) => `${entry.title} ${entry.category} ${entry.tags.join(" ")}`.toLowerCase().includes(needle)) : entries;
  }, [entries, query]);

  function openEdit(entry: KnowledgeRow) {
    setEditor({ id: entry.id, title: entry.title, category: entry.category as KnowledgeCategory, content: entry.content, tags: entry.tags.join(", "), is_published: entry.is_published });
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!editor) return;
    setBusy(true);
    const tags = editor.tags.split(",").map((tag) => tag.trim().toLowerCase()).filter(Boolean);
    const slug = editor.id || editor.title.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80) || crypto.randomUUID();
    const values = { id: slug, title: editor.title.trim(), category: editor.category, content: editor.content.trim(), tags, is_published: editor.is_published, updated_by: user.id };
    const existing = entries.some((entry) => entry.id === editor.id);
    const result = existing
      ? await supabase.from("knowledge_entries").update(values).eq("id", editor.id)
      : await supabase.from("knowledge_entries").insert({ ...values, created_by: user.id });
    setBusy(false);
    if (result.error) { toast.error(result.error.message); return; }
    toast.success(existing ? "Entry updated." : "Entry added.");
    setEditor(null); await load();
  }

  async function remove() {
    if (!deleting) return;
    setBusy(true);
    const { error } = await supabase.from("knowledge_entries").delete().eq("id", deleting.id);
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Entry removed."); setDeleting(null); await load();
  }

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    await navigate({ to: "/auth", replace: true });
  }

  if (allowed === null) return <div className="mx-auto max-w-6xl px-4 py-20 text-sm text-muted-foreground">Opening the library…</div>;
  if (!allowed) return <div className="mx-auto max-w-lg px-4 py-20 text-center"><ShieldAlert className="mx-auto h-10 w-10 text-terracotta" /><h1 className="mt-4 text-3xl">This account is not a keeper</h1><p className="mt-3 text-sm text-muted-foreground">Your account is signed in, but it does not have administrator access.</p><Button asChild className="mt-6"><Link to="/knowledge">Read the library</Link></Button></div>;

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-muted/35">
      <div className="border-b bg-background"><div className="mx-auto max-w-7xl px-4 py-8 sm:px-6"><div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs uppercase tracking-widest text-terracotta">Keeper's workspace</p><h1 className="mt-2 text-3xl sm:text-4xl">What we ourselves say</h1><p className="mt-2 text-sm text-muted-foreground">{entries.length} entries · {entries.filter((entry) => entry.is_published).length} published</p></div><div className="flex gap-2"><Button variant="outline" size="icon" onClick={signOut} title="Sign out"><LogOut /><span className="sr-only">Sign out</span></Button><Button onClick={() => setEditor({ ...EMPTY })}><Plus /> Add entry</Button></div></div></div></div>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="relative max-w-md"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, category, or tag" className="pl-9 bg-background" /></div>
        <div className="mt-6 overflow-hidden rounded-md border bg-background">
          <div className="hidden grid-cols-[1fr_180px_110px_92px] gap-4 border-b bg-muted/60 px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground md:grid"><span>Entry</span><span>Category</span><span>Status</span><span className="text-right">Actions</span></div>
          {filtered.map((entry) => <div key={entry.id} className="grid gap-3 border-b px-4 py-4 last:border-b-0 md:grid-cols-[1fr_180px_110px_92px] md:items-center"><div className="min-w-0"><p className="font-medium truncate">{entry.title}</p><p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{entry.content}</p></div><p className="text-sm text-muted-foreground">{entry.category}</p><span className={entry.is_published ? "w-fit rounded-full bg-primary/10 px-2 py-1 text-xs text-primary" : "w-fit rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground"}>{entry.is_published ? "Published" : "Draft"}</span><div className="flex justify-end gap-1"><Button variant="ghost" size="icon" onClick={() => openEdit(entry)} title="Edit entry"><Edit3 /><span className="sr-only">Edit</span></Button><Button variant="ghost" size="icon" onClick={() => setDeleting(entry)} title="Delete entry" className="text-destructive hover:text-destructive"><Trash2 /><span className="sr-only">Delete</span></Button></div></div>)}
          {filtered.length === 0 && <div className="px-4 py-16 text-center text-sm text-muted-foreground"><BookOpen className="mx-auto mb-3 h-8 w-8 opacity-40" />No entries found.</div>}
        </div>
      </div>

      <Dialog open={editor !== null} onOpenChange={(open) => { if (!open) setEditor(null); }}><DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">{editor && <form onSubmit={save}><DialogHeader><DialogTitle>{entries.some((entry) => entry.id === editor.id) ? "Edit entry" : "Add to our library"}</DialogTitle><DialogDescription>Write from inside Ai wa, in our own voice.</DialogDescription></DialogHeader><div className="grid gap-5 py-6"><div className="space-y-2"><Label htmlFor="title">Title</Label><Input id="title" required minLength={2} maxLength={160} value={editor.title} onChange={(event) => setEditor({ ...editor, title: event.target.value })} /></div><div className="space-y-2"><Label>Category</Label><Select value={editor.category} onValueChange={(value) => setEditor({ ...editor, category: value as KnowledgeCategory })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{KNOWLEDGE_CATEGORIES.map((category) => <SelectItem key={category} value={category}>{category}</SelectItem>)}</SelectContent></Select></div><div className="space-y-2"><Label htmlFor="content">Our account</Label><Textarea id="content" required minLength={10} maxLength={10000} rows={9} value={editor.content} onChange={(event) => setEditor({ ...editor, content: event.target.value })} /></div><div className="space-y-2"><Label htmlFor="tags">Tags</Label><Input id="tags" value={editor.tags} onChange={(event) => setEditor({ ...editor, tags: event.target.value })} placeholder="alekwu, ancestors, festival" /><p className="text-xs text-muted-foreground">Separate tags with commas.</p></div><div className="flex items-center justify-between rounded-md border p-3"><div><Label htmlFor="published">Published</Label><p className="text-xs text-muted-foreground">Visible to everyone and available to the AI.</p></div><Switch id="published" checked={editor.is_published} onCheckedChange={(checked) => setEditor({ ...editor, is_published: checked })} /></div></div><DialogFooter><Button type="button" variant="outline" onClick={() => setEditor(null)}>Cancel</Button><Button type="submit" disabled={busy}>Save entry</Button></DialogFooter></form>}</DialogContent></Dialog>
      <AlertDialog open={deleting !== null} onOpenChange={(open) => { if (!open) setDeleting(null); }}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Remove this entry?</AlertDialogTitle><AlertDialogDescription>“{deleting?.title}” will disappear from the public library and the AI's trusted sources. This cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Keep entry</AlertDialogCancel><AlertDialogAction onClick={remove} disabled={busy} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Remove entry</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </div>
  );
}