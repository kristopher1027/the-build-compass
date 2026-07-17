import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { chatComplete } from "@/lib/chat.functions";
import { ArrowLeftRight, Copy, Check, Loader2 } from "lucide-react";

export const Route = createFileRoute("/translate")({
  head: () => ({
    meta: [
      { title: "English ↔ Idoma — IdomaConnect AI" },
      {
        name: "description",
        content: "Say it in Idoma. For when the mouth has forgotten but the heart still remembers.",
      },
      { property: "og:title", content: "English ↔ Idoma" },
      {
        property: "og:description",
        content: "Translate between English and Idoma, in the voice of Ai wa.",
      },
    ],
  }),
  component: TranslatePage,
});

type Direction = "en-io" | "io-en";

function TranslatePage() {
  const call = useServerFn(chatComplete);
  const [dir, setDir] = useState<Direction>("en-io");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [from, to] = dir === "en-io" ? ["English", "Idoma"] : ["Idoma", "English"];

  async function translate() {
    if (!input.trim() || loading) return;
    setLoading(true);
    setError(null);
    setOutput("");
    try {
      const res = await call({
        data: {
          system: `You are a native ${from}-to-${to} translator for Idoma — the language of Ai wa (southern Benue State, Nigeria). You are Idoma yourself; you are not translating from outside.

Rules:
- Return ONLY the translation. No preface, no "Translation:", no quotes, no explanation.
- Match register: casual → casual, respectful → respectful. If the source addresses an elder, keep the elder respect in the target.
- Where there is no direct word, use the closest natural expression Ai wa would actually say.
- Prefer the Otukpo-central form unless the source is clearly another dialect.
- If the input is not in ${from}, translate it to ${to} anyway.`,
          messages: [{ role: "user", content: input.trim() }],
        },
      });
      setOutput(res.content.trim());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Translation failed.");
    } finally {
      setLoading(false);
    }
  }

  function swap() {
    setDir(dir === "en-io" ? "io-en" : "en-io");
    setInput(output);
    setOutput(input);
  }

  async function copy() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
      <div className="mb-8">
        <div className="text-xs font-medium tracking-widest uppercase text-terracotta">Say it in Idoma</div>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl">English ↔ Idoma</h1>
        <p className="mt-3 text-muted-foreground">For when the mouth has forgotten but the heart still remembers.</p>
      </div>

      <div className="rounded-2xl border bg-card p-4 sm:p-6 shadow-sm">
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4 text-sm font-medium">
          <span className="px-3 py-1.5 rounded-full bg-secondary">{from}</span>
          <button
            onClick={swap}
            className="w-9 h-9 rounded-full border hover:bg-secondary flex items-center justify-center transition"
            aria-label="Swap languages"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
          <span className="px-3 py-1.5 rounded-full bg-secondary">{to}</span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider">{from}</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={dir === "en-io" ? "Type in English..." : "Type in Idoma..."}
              rows={6}
              className="mt-2 w-full resize-none rounded-xl border bg-background p-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs text-muted-foreground uppercase tracking-wider">{to}</label>
              {output && (
                <button
                  onClick={copy}
                  className="text-xs inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              )}
            </div>
            <div className="mt-2 min-h-[10rem] rounded-xl border bg-muted/40 p-4 text-sm whitespace-pre-wrap">
              {loading ? (
                <span className="inline-flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" /> Translating…
                </span>
              ) : (
                output || <span className="text-muted-foreground">Translation appears here.</span>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={translate}
            disabled={loading || !input.trim()}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-40 transition"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Translate
          </button>
        </div>
      </div>

      <p className="mt-4 text-xs text-muted-foreground text-center">
        Our tongue changes shape between clans — Otukpo, Agatu, Adoka, Orokam. Translations lean on the Otukpo-central form.
      </p>
    </div>
  );
}
