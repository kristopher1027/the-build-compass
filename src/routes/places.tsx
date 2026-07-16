import { createFileRoute } from "@tanstack/react-router";
import { PLACES } from "@/data/content";
import { MapPin } from "lucide-react";

export const Route = createFileRoute("/places")({
  head: () => ({
    meta: [
      { title: "Historical Places of Idomaland — IdomaConnect AI" },
      {
        name: "description",
        content: "Explore sacred hills, ancient caves, palaces, and cultural landmarks of Idomaland.",
      },
      { property: "og:title", content: "Historical Places of Idomaland" },
      {
        property: "og:description",
        content: "A curated guide to the historical and cultural sites of the Idoma people.",
      },
    ],
  }),
  component: PlacesPage,
});

function PlacesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <div className="mb-10">
        <div className="text-xs font-medium tracking-widest uppercase text-terracotta">
          Historical Places
        </div>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl">Landmarks of Idomaland.</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          The sacred hills, ancestral caves, palaces, and rivers that hold the memory
          of the Idoma people.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PLACES.map((p) => (
          <article
            key={p.name}
            className="rounded-2xl border bg-card p-6 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center gap-2 text-xs text-terracotta">
              <MapPin className="w-3.5 h-3.5" /> {p.location}
            </div>
            <h2 className="mt-2 font-display text-xl">{p.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{p.summary}</p>
            <div className="mt-4 pt-4 border-t">
              <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">
                Significance
              </div>
              <p className="text-sm">{p.significance}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
