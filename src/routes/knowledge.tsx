import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { KNOWLEDGE, KNOWLEDGE_CATEGORIES, type KnowledgeCategory } from "@/data/knowledge";
import { BookOpen, Search, Sparkles } from "lucide-react";

export const Route = createFileRoute("/knowledge")({
  head: () => ({
    meta: [
      { title: "Verified Idoma Knowledge Base — IdomaConnect AI" },
      {
        name: "description",
        content:
          "A curated, verified library of Idoma history, rulers, clans, festivals, proverbs, greetings, and cultural practices — the corpus our AI consults before it answers.",
      },
      { property: "og:title", content: "Verified Idoma Knowledge Base" },
      {
        property: "og:description",
        content:
          "The curated Idoma corpus our AI cites — history, rulers, clans, festivals, and cultural practices.",
      },
    ],
  }),
  component: KnowledgePage,
});

function KnowledgePage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<KnowledgeCategory | "All">("All");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return KNOWLEDGE.filter((e) => {
      if (cat !== "All" && e.category !== cat) return false;
      if (!query) return true;
      const hay = `${e.title} ${e.content} ${(e.tags ?? []).join(" ")}`.toLowerCase();
      return hay.includes(query);
    });
  }, [q, cat]);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <div className="mb-8">
        <div className="text-xs font-medium tracking-widest uppercase text-terracotta inline-flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5" /> Verified Knowledge Base
        </div>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl">
          The corpus behind the AI.
        </h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          A hand-curated library of Idoma history, rulers, clans, festivals,
          proverbs, greetings, and cultural practices. The Cultural Assistant
          consults these entries before answering and cites them by name — so
          you can trust the source, not just the model.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Link
            to="/assistant"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Sparkles className="w-4 h-4" /> Ask the grounded AI
          </Link>
          <span className="text-xs text-muted-foreground">
            {KNOWLEDGE.length} verified entries across {KNOWLEDGE_CATEGORIES.length} categories
          </span>
        </div>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search the corpus (e.g. Alekwu, Otukpo, proverb)…"
            className="w-full rounded-full border bg-background pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(["All", ...KNOWLEDGE_CATEGORIES] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCat(c as KnowledgeCategory | "All")}
              className={`px-3 py-1.5 rounded-full text-xs border transition ${
                cat === c
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary text-secondary-foreground border-transparent hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-sm text-muted-foreground">
          No entries match that search.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((e) => (
            <article
              key={e.id}
              className="rounded-2xl border bg-card p-5 shadow-sm flex flex-col"
            >
              <div className="text-[10px] font-medium uppercase tracking-widest text-terracotta">
                {e.category}
              </div>
              <h2 className="mt-1.5 font-display text-lg leading-snug">{e.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">
                {e.content}
              </p>
              {e.tags && e.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {e.tags.slice(0, 5).map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
