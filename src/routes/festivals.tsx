import { createFileRoute } from "@tanstack/react-router";
import { FESTIVALS } from "@/data/content";
import { Calendar } from "lucide-react";

export const Route = createFileRoute("/festivals")({
  head: () => ({
    meta: [
      { title: "Idoma Festivals & Celebrations — IdomaConnect AI" },
      {
        name: "description",
        content: "Discover Aje-Alekwu, Eje-Alago, new yam, and other traditional Idoma festivals.",
      },
      { property: "og:title", content: "Idoma Festivals" },
      {
        property: "og:description",
        content: "A guide to the annual festivals and celebrations of the Idoma people.",
      },
    ],
  }),
  component: FestivalsPage,
});

function FestivalsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <div className="mb-10">
        <div className="text-xs font-medium tracking-widest uppercase text-terracotta">
          Festivals
        </div>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl">The rhythms of the Idoma year.</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          Ancestral thanksgiving, harvest celebrations, and rites of passage — the
          festivals that bind the Idoma community together.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {FESTIVALS.map((f) => (
          <article key={f.name} className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 text-xs text-terracotta">
              <Calendar className="w-3.5 h-3.5" /> {f.when}
            </div>
            <h2 className="mt-2 font-display text-2xl">{f.name}</h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.summary}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
