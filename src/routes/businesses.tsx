import { createFileRoute } from "@tanstack/react-router";
import { BUSINESSES } from "@/data/content";
import { Store, MapPin } from "lucide-react";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/businesses")({
  head: () => ({
    meta: [
      { title: "Local Business Directory — IdomaConnect AI" },
      {
        name: "description",
        content: "Hotels, restaurants, artisans, tailors, and services across Idomaland.",
      },
      { property: "og:title", content: "Idomaland Business Directory" },
      {
        property: "og:description",
        content: "Discover businesses that keep Idoma culture and economy alive.",
      },
    ],
  }),
  component: BusinessesPage,
});

function BusinessesPage() {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(BUSINESSES.map((b) => b.category)))],
    [],
  );
  const [cat, setCat] = useState("All");

  const filtered = cat === "All" ? BUSINESSES : BUSINESSES.filter((b) => b.category === cat);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <div className="mb-8">
        <div className="text-xs font-medium tracking-widest uppercase text-terracotta">
          Local Directory
        </div>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl">Businesses across Idomaland.</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          Discover the artisans, restaurants, tailors, and services that make up the
          modern Idoma economy.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
              cat === c
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background hover:bg-secondary"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((b) => (
          <article key={b.name} className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 text-xs text-terracotta">
              <Store className="w-3.5 h-3.5" /> {b.category}
            </div>
            <h2 className="mt-2 font-display text-xl">{b.name}</h2>
            <div className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" /> {b.location}
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{b.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
