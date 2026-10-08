import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getPublishedKnowledge } from "@/lib/knowledge.functions";
import { ExternalLink, Store, MapPin } from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";

const businessesQuery = queryOptions({ queryKey: ["published-knowledge"], queryFn: () => getPublishedKnowledge() });

export const Route = createFileRoute("/businesses")({
  head: () => ({
    meta: [
      { title: "Hands holding it up — IdomaConnect AI" },
      {
        name: "description",
        content: "Verified transport, media, education and hospitality services in Otukpo, Ugbokolo and nearby communities.",
      },
      { property: "og:title", content: "Hands holding it up — Ai wa today" },
      {
        property: "og:description",
        content: "Source-backed businesses and services across Idomaland.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(businessesQuery),
  component: BusinessesPage,
  errorComponent: () => <div className="mx-auto max-w-3xl px-4 py-20 text-center">We could not open the business directory just now.</div>,
  notFoundComponent: () => <div className="mx-auto max-w-3xl px-4 py-20 text-center">That businesses page was not found.</div>,
});

function BusinessesPage() {
  const { data } = useSuspenseQuery(businessesQuery);
  const businesses = data.filter((entry) => entry.category === "Businesses");
  const kind = (tags: string[] | undefined) => tags?.includes("hotel") ? "Hospitality" : tags?.includes("transport") ? "Transport" : tags?.includes("radio") ? "Media" : "Education";
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(businesses.map((entry) => kind(entry.tags))))],
    [businesses],
  );
  const [cat, setCat] = useState("All");

  const filtered = cat === "All" ? businesses : businesses.filter((entry) => kind(entry.tags) === cat);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <div className="mb-8">
        <div className="text-xs font-medium tracking-widest uppercase text-terracotta">
          Sons and daughters of the soil
        </div>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl">The hands holding it up today.</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          Transport, radio, education and places to stay in our communities.
          Every listing is tied to a published source, and details that may
          change should still be confirmed before travel.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((c) => (
          <Button
            key={c}
            onClick={() => setCat(c)}
            variant={cat === c ? "default" : "outline"}
            size="sm"
            className="rounded-full"
          >
            {c}
          </Button>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((business) => (
          <article key={business.id} className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 text-xs text-terracotta">
              <Store className="w-3.5 h-3.5" /> {kind(business.tags)}
            </div>
            <h2 className="mt-2 font-display text-xl">{business.title}</h2>
            <div className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" /> {business.tags?.includes("ugbokolo") ? "Ugbokolo" : "Otukpo"}
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{business.content}</p>
            {business.source_url && <a href={business.source_url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">{business.source_label ?? "Read the source"} <ExternalLink className="h-3 w-3" /></a>}
          </article>
        ))}
      </div>
    </div>
  );
}
