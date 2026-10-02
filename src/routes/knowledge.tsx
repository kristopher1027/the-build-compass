import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { KNOWLEDGE_CATEGORIES, type KnowledgeCategory } from "@/data/knowledge";
import { getPublishedKnowledge } from "@/lib/knowledge.functions";
import { BookOpen, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const knowledgeQuery = queryOptions({ queryKey: ["published-knowledge"], queryFn: () => getPublishedKnowledge() });

export const Route = createFileRoute("/knowledge")({
  loader: ({ context }) => context.queryClient.ensureQueryData(knowledgeQuery),
  head: () => ({
    meta: [
      { title: "What we ourselves say — IdomaConnect AI" },
      {
        name: "description",
        content:
          "The verified corpus of Ai wa — our history, rulers, clans, festivals, proverbs and greetings, written from inside the culture. The library the AI reads before it answers.",
      },
      { property: "og:title", content: "What we ourselves say — Ai wa" },
      {
        property: "og:description",
        content: "The Idoma corpus our AI cites — in our own voice.",
      },
    ],
  }),
  component: KnowledgePage,
  errorComponent: () => <div className="mx-auto max-w-3xl px-4 py-20 text-center"><h1 className="text-3xl">The library is resting</h1><p className="mt-3 text-sm text-muted-foreground">We could not open our words just now. Please try again.</p></div>,
  notFoundComponent: () => <div className="mx-auto max-w-3xl px-4 py-20 text-center">That knowledge page was not found.</div>,
});

function KnowledgePage() {
  const { data: knowledge } = useSuspenseQuery(knowledgeQuery);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<KnowledgeCategory | "All">("All");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return knowledge.filter((e) => {
      if (cat !== "All" && e.category !== cat) return false;
      if (!query) return true;
      const hay = `${e.title} ${e.content} ${(e.tags ?? []).join(" ")}`.toLowerCase();
      return hay.includes(query);
    });
  }, [q, cat, knowledge]);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <div className="mb-8">
        <div className="text-xs font-medium tracking-widest uppercase text-terracotta inline-flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5" /> What we ourselves say
        </div>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl">
          The words of Ai wa, in our own voice.
        </h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          A library written from inside the culture — the way our fathers
          would tell it, not the way a stranger would summarise it. The AI on
          this site reads these entries first and cites them back to you, so
          you know the answer came from us.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Link
            to="/assistant"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Sparkles className="w-4 h-4" /> Ask, grounded in this
          </Link>
          <span className="text-xs text-muted-foreground">
            {knowledge.length} entries · {KNOWLEDGE_CATEGORIES.length} categories · all in our voice
          </span>
        </div>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search Ai wa (Alekwu, ápà, Otukpo, ije…)"
            className="w-full rounded-full border bg-background pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(["All", ...KNOWLEDGE_CATEGORIES] as const).map((c) => (
            <Button
              variant={cat === c ? "default" : "secondary"}
              size="sm"
              key={c}
              onClick={() => setCat(c as KnowledgeCategory | "All")}
              className="rounded-full"
            >
              {c}
            </Button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-sm text-muted-foreground">
          Nothing under that name yet. Ask an elder — or try another word.
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
