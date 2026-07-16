import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { chatComplete } from "@/lib/chat.functions";
import { Sparkles, Loader2 } from "lucide-react";

export const Route = createFileRoute("/stories")({
  head: () => ({
    meta: [
      { title: "Idoma Storyteller — IdomaConnect AI" },
      {
        name: "description",
        content: "AI-generated Idoma folktales, legends, and moral stories.",
      },
      { property: "og:title", content: "Idoma Storyteller" },
      {
        property: "og:description",
        content: "Ancient Idoma legends and folktales, retold by AI.",
      },
    ],
  }),
  component: StoriesPage,
});

type Mode = "kids" | "teen" | "adult";
const MODES: { id: Mode; label: string; desc: string }[] = [
  { id: "kids", label: "Kids", desc: "Simple, warm, moral tales" },
  { id: "teen", label: "Teens", desc: "Adventure with cultural depth" },
  { id: "adult", label: "Adults", desc: "Rich legends and ancestral lore" },
];

const TOPICS = [
  "A legend of Alekwu the ancestor",
  "Why the tortoise has a cracked shell",
  "The founding of Otukpo",
  "A tale of the new yam festival",
  "Why the drum speaks to spirits",
];

function StoriesPage() {
  const call = useServerFn(chatComplete);
  const [mode, setMode] = useState<Mode>("teen");
  const [topic, setTopic] = useState("");
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate(t: string) {
    const prompt = t.trim();
    if (!prompt || loading) return;
    setLoading(true);
    setError(null);
    setStory("");
    try {
      const res = await call({
        data: {
          system: `You are an Idoma storyteller in the oral tradition. Write an original folktale or legend rooted in Idoma culture (Benue State, Nigeria), drawing on Alekwu ancestor veneration, the land, clan life, and Idoma moral values.

Audience: ${mode === "kids" ? "children (simple language, warm tone, clear moral)" : mode === "teen" ? "teenagers (vivid, adventurous, culturally rich)" : "adults (deeper metaphor, mature themes, layered meaning)"}.

Structure:
- A short evocative title on the first line.
- 4-8 short paragraphs.
- End with the moral or takeaway, framed in Idoma wisdom.

Be culturally respectful; do not invent specific real living rulers or people.`,
          messages: [{ role: "user", content: `Tell me a story about: ${prompt}` }],
        },
      });
      setStory(res.content);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Story generation failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <div className="mb-8">
        <div className="text-xs font-medium tracking-widest uppercase text-terracotta">
          Storyteller
        </div>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl">Folktales of the Idoma.</h1>
        <p className="mt-3 text-muted-foreground">
          Choose a mood and a theme — the AI retells stories in the Idoma oral tradition.
        </p>
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex flex-wrap gap-2 mb-4">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition border ${
                mode === m.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background hover:bg-secondary"
              }`}
            >
              {m.label}
              <span className="ml-2 text-xs opacity-70">{m.desc}</span>
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && generate(topic)}
            placeholder="A tale about..."
            className="flex-1 rounded-xl border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            onClick={() => generate(topic)}
            disabled={loading || !topic.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Tell it
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {TOPICS.map((t) => (
            <button
              key={t}
              onClick={() => {
                setTopic(t);
                generate(t);
              }}
              className="text-xs px-3 py-1.5 rounded-full border bg-secondary/60 hover:bg-secondary transition"
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mt-4 text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      {(story || loading) && (
        <article className="mt-8 rounded-2xl border bg-card p-6 sm:p-10 shadow-sm">
          {loading ? (
            <div className="text-muted-foreground inline-flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> The storyteller is thinking…
            </div>
          ) : (
            <div className="prose prose-sm max-w-none whitespace-pre-wrap font-display text-foreground leading-relaxed text-[17px]">
              {story}
            </div>
          )}
        </article>
      )}
    </div>
  );
}
