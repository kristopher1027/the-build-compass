import { createFileRoute } from "@tanstack/react-router";
import { FESTIVALS } from "@/data/content";
import { Calendar } from "lucide-react";

export const Route = createFileRoute("/festivals")({
  head: () => ({
    meta: [
      { title: "The year in Ai wa — IdomaConnect AI" },
      {
        name: "description",
        content:
          "Aje-Alekwu, Eje-Alago, Ito Ogwu, Ekwuchi — the days we come together, told from inside Ai wa.",
      },
      { property: "og:title", content: "The year in Ai wa" },
      {
        property: "og:description",
        content: "The Idoma festival year, told from inside the culture.",
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
          The year in Ai wa
        </div>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl">The days we come together.</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          A year in Ai wa moves to its own drum — the ancestors are called
          home, the yam is thanked, the young ones are 'crossed' into
          adulthood. These are the days no one in our clan misses.
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
