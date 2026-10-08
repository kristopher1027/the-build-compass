import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getPublishedKnowledge } from "@/lib/knowledge.functions";
import { ExternalLink, MapPin } from "lucide-react";

const placesQuery = queryOptions({ queryKey: ["published-knowledge"], queryFn: () => getPublishedKnowledge() });

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
        content: "Source-backed places to know and visit across Idomaland.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(placesQuery),
  component: PlacesPage,
  errorComponent: () => <div className="mx-auto max-w-3xl px-4 py-20 text-center">We could not open these places just now.</div>,
  notFoundComponent: () => <div className="mx-auto max-w-3xl px-4 py-20 text-center">That places page was not found.</div>,
});

function PlacesPage() {
  const { data } = useSuspenseQuery(placesQuery);
  const places = data.filter((entry) => entry.category === "Tourist Sites");
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <div className="mb-10">
        <div className="text-xs font-medium tracking-widest uppercase text-terracotta">
          Where we come from
        </div>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl">The ground that carries our names.</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          Otukpo where our roads meet, the Och’Idoma Palace, Owukpa and the
          institutions serving our communities — each account checked against
          a published source.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {places.map((place) => (
          <article
            key={place.id}
            className="rounded-2xl border bg-card p-6 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center gap-2 text-xs text-terracotta">
              <MapPin className="w-3.5 h-3.5" /> Idomaland
            </div>
            <h2 className="mt-2 font-display text-xl">{place.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{place.content}</p>
            {place.source_url && <a href={place.source_url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 border-t pt-4 text-xs font-medium text-primary hover:underline">{place.source_label ?? "Read the source"} <ExternalLink className="h-3 w-3" /></a>}
          </article>
        ))}
      </div>
    </div>
  );
}
