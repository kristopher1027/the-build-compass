import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Check, Loader2, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { deleteGlossaryEntry, getAdminGlossary, saveGlossaryEntry } from "@/lib/glossary.functions";
import type { Database } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

type Entry = Database["public"]["Tables"]["translation_glossary"]["Row"];
type Draft = Omit<Entry, "created_at" | "created_by" | "updated_at" | "updated_by">;

const EMPTY_DRAFT: Draft = {
  id: "",
  english_term: "",
  yoruba_term: "",
  idoma_term: "",
  dialect_notes: "",
  example_english: "",
  example_yoruba: "",
  example_idoma: "",
  source_name: "",
  source_license: "",
  reviewer: "",
  is_approved: false,
};

export function TranslationGlossaryManager() {
  const loadEntries = useServerFn(getAdminGlossary);
  const saveEntry = useServerFn(saveGlossaryEntry);
  const deleteEntry = useServerFn(deleteGlossaryEntry);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setEntries(await loadEntries());
      setError("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Glossary could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [loadEntries]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = entries.filter((entry) =>
    [entry.english_term, entry.yoruba_term, entry.idoma_term, entry.dialect_notes]
      .join(" ")
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!draft || busy) return;
    if (!draft.yoruba_term?.trim() && !draft.idoma_term?.trim()) {
      setError("Add a Yoruba or Idoma translation.");
      return;
    }
    if (
      draft.is_approved &&
      (!draft.source_name.trim() || !draft.source_license.trim() || !draft.reviewer.trim())
    ) {
      setError("Approval requires a source, license or permission, and reviewer.");
      return;
    }

    setBusy(true);
    setError("");
    setNotice("");
    try {
      const { id, ...fields } = draft;
      await saveEntry({ data: id ? { ...fields, id } : fields });
      setDraft(null);
      setNotice("Glossary entry saved.");
      await load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Glossary entry could not be saved.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(entry: Entry) {
    if (!window.confirm(`Delete the glossary entry for “${entry.english_term}”?`)) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await deleteEntry({ data: { id: entry.id } });
      setNotice("Glossary entry deleted.");
      await load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Glossary entry could not be deleted.");
    } finally {
      setBusy(false);
    }
  }

  function field<Key extends keyof Draft>(key: Key, value: Draft[Key]) {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
  }

  return (
    <section
      className="mx-auto max-w-7xl px-4 pb-12 sm:px-6"
      aria-labelledby="translation-glossary-title"
    >
      <div className="border-t pt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-terracotta">
              Reviewed language pairs
            </p>
            <h2 id="translation-glossary-title" className="mt-2 text-2xl">
              Translation glossary
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Only approved entries guide translation. Approval requires source and license details
              plus a reviewer.
            </p>
          </div>
          <Button
            onClick={() => {
              setDraft({ ...EMPTY_DRAFT });
              setError("");
              setNotice("");
            }}
          >
            <Plus /> Add term
          </Button>
        </div>

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {error}
          </p>
        )}
        {notice && (
          <p role="status" className="mt-4 rounded-md bg-primary/10 px-3 py-2 text-sm text-primary">
            {notice}
          </p>
        )}

        {draft && (
          <form onSubmit={save} className="mt-6 space-y-6 border-y py-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="glossary-english">English term or phrase</Label>
                <Input
                  id="glossary-english"
                  required
                  maxLength={160}
                  value={draft.english_term}
                  onChange={(event) => field("english_term", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="glossary-yoruba">Yoruba</Label>
                <Input
                  id="glossary-yoruba"
                  maxLength={160}
                  value={draft.yoruba_term ?? ""}
                  onChange={(event) => field("yoruba_term", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="glossary-idoma">Idoma</Label>
                <Input
                  id="glossary-idoma"
                  maxLength={160}
                  value={draft.idoma_term ?? ""}
                  onChange={(event) => field("idoma_term", event.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="glossary-example-en">English example</Label>
                <Textarea
                  id="glossary-example-en"
                  maxLength={1000}
                  rows={3}
                  value={draft.example_english}
                  onChange={(event) => field("example_english", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="glossary-example-yo">Yoruba example</Label>
                <Textarea
                  id="glossary-example-yo"
                  maxLength={1000}
                  rows={3}
                  value={draft.example_yoruba}
                  onChange={(event) => field("example_yoruba", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="glossary-example-io">Idoma example</Label>
                <Textarea
                  id="glossary-example-io"
                  maxLength={1000}
                  rows={3}
                  value={draft.example_idoma}
                  onChange={(event) => field("example_idoma", event.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="glossary-notes">Dialect or tone notes</Label>
                <Textarea
                  id="glossary-notes"
                  maxLength={2000}
                  rows={3}
                  value={draft.dialect_notes}
                  onChange={(event) => field("dialect_notes", event.target.value)}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="glossary-source">Source</Label>
                  <Input
                    id="glossary-source"
                    maxLength={200}
                    value={draft.source_name}
                    onChange={(event) => field("source_name", event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="glossary-license">License or permission</Label>
                  <Input
                    id="glossary-license"
                    maxLength={500}
                    value={draft.source_license}
                    onChange={(event) => field("source_license", event.target.value)}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="glossary-reviewer">Native-speaker reviewer</Label>
                  <Input
                    id="glossary-reviewer"
                    maxLength={160}
                    value={draft.reviewer}
                    onChange={(event) => field("reviewer", event.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Switch
                  id="glossary-approved"
                  checked={draft.is_approved}
                  onCheckedChange={(checked) => field("is_approved", checked)}
                />
                <Label htmlFor="glossary-approved">Approved for translation use</Label>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setDraft(null)}>
                  <X /> Cancel
                </Button>
                <Button type="submit" disabled={busy}>
                  {busy ? <Loader2 className="animate-spin" /> : <Check />}
                  Save entry
                </Button>
              </div>
            </div>
          </form>
        )}

        <div className="relative mt-6 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search terms and notes"
            className="pl-9"
          />
        </div>

        <div className="mt-4 divide-y border-y">
          {loading ? (
            <p className="py-8 text-sm text-muted-foreground">Loading glossary…</p>
          ) : filtered.length === 0 ? (
            <p className="py-8 text-sm text-muted-foreground">No glossary entries yet.</p>
          ) : (
            filtered.map((entry) => (
              <article
                key={entry.id}
                className="grid gap-4 py-4 md:grid-cols-[1fr_1fr_1fr_auto] md:items-start"
              >
                <div>
                  <p className="font-medium">{entry.english_term}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {entry.is_approved ? "Approved" : "Needs review"}
                  </p>
                </div>
                <p className="text-sm">
                  <span className="text-muted-foreground">Yoruba: </span>
                  {entry.yoruba_term || "—"}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Idoma: </span>
                  {entry.idoma_term || "—"}
                </p>
                <div className="flex justify-end gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Edit ${entry.english_term}`}
                    onClick={() => {
                      setDraft({ ...entry });
                      setError("");
                      setNotice("");
                    }}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete ${entry.english_term}`}
                    disabled={busy}
                    onClick={() => void remove(entry)}
                  >
                    <Trash2 />
                  </Button>
                </div>
                {(entry.source_name || entry.dialect_notes) && (
                  <p className="text-xs text-muted-foreground md:col-span-3">
                    {[entry.dialect_notes, entry.source_name, entry.source_license, entry.reviewer]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                )}
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
