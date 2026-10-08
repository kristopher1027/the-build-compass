import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getPublishedKnowledge } from "@/lib/knowledge.functions";
import { Calendar, ExternalLink } from "lucide-react";

const festivalsQuery = queryOptions({ queryKey: ["published-knowledge"], queryFn: () => getPublishedKnowledge() });

export const Route = createFileRoute("/festivals")({
  head: () => ({
    meta: [
      { title: "The year in Ai wa — IdomaConnect AI" },
      {
        name: "description",
        content:
          "Idoma International Carnival, Ech’ija, Alekwu and local new-yam celebrations, checked against published sources.",
      },
      { property: "og:title", content: "The year in Ai wa" },
      {
        property: "og:description",
        content: "Source-backed Idoma festivals and their local calendars.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(festivalsQuery),
  component: FestivalsPage,
  errorComponent: () => <div className="mx-auto max-w-3xl px-4 py-20 text-center">We could not open the festival calendar just now.</div>,
  notFoundComponent: () => <div className="mx-auto max-w-3xl px-4 py-20 text-center">That festivals page was not found.</div>,
});

function FestivalsPage() {
  const { data } = useSuspenseQuery(festivalsQuery);
  const festivals = data.filter((entry) => entry.category === "Festivals");
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <div className="mb-10">
        <div className="text-xs font-medium tracking-widest uppercase text-terracotta">
          The year in Ai wa
        </div>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl">The days we come together.</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          Our modern carnival, the youth-led Ech’ija festival, Alekwu and
          local harvest celebrations. Dates differ by community, so each
          record says what the published source can support.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {festivals.map((festival) => (
          <article key={festival.id} className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 text-xs text-terracotta">
              <Calendar className="w-3.5 h-3.5" /> Our festival calendar
            </div>
            <h2 className="mt-2 font-display text-2xl">{festival.title}</h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{festival.content}</p>
            {festival.source_url && <a href={festival.source_url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">{festival.source_label ?? "Read the source"} <ExternalLink className="h-3 w-3" /></a>}
          </article>
        ))}
      </div>
    </div>
  );
}
