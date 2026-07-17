import { createFileRoute } from "@tanstack/react-router";
import { PLACES } from "@/data/content";
import { MapPin } from "lucide-react";

export const Route = createFileRoute("/places")({
  head: () => ({
    meta: [
      { title: "Where we come from — IdomaConnect AI" },
      {
        name: "description",
        content:
          "Otukpo, Ojira Hills, the Ogbadibo caves, the palace of Ọch'Idoma — the ground that carries our names, told from inside Ai wa.",
      },
      { property: "og:title", content: "Where we come from" },
      {
        property: "og:description",
        content: "The sacred hills, caves, and palaces of Ai wa — in our own voice.",
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
          Where we come from
        </div>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl">The ground that carries our names.</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          Otukpo where the roads meet, Ojira where the ancestors walk, the
          caves at Ogbadibo where our clan names were first spoken — this is
          Ai wa, told by the people who still live it.
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
                Why it matters to us
              </div>
              <p className="text-sm">{p.significance}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
