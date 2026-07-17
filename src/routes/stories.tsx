import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { chatComplete } from "@/lib/chat.functions";
import { Sparkles, Loader2 } from "lucide-react";

export const Route = createFileRoute("/stories")({
  head: () => ({
    meta: [
      { title: "Folktales by the fire — IdomaConnect AI" },
      {
        name: "description",
        content:
          "Idoma folktales in the shape of the ones our grandfathers told after the yam was eaten.",
      },
      { property: "og:title", content: "Folktales by the fire" },
      {
        property: "og:description",
        content: "Stories the way we tell them in Ai wa.",
      },
    ],
  }),
  component: StoriesPage,
});

type Mode = "kids" | "teen" | "adult";
const MODES: { id: Mode; label: string; desc: string }[] = [
  { id: "kids", label: "Little ones", desc: "Short, warm, a clear moral" },
  { id: "teen", label: "Young ones", desc: "Vivid, brave, thick with our ways" },
  { id: "adult", label: "Elders", desc: "Layered, Alekwu-touched, patient" },
];

const TOPICS = [
  "How Alekwu answered the disobedient son",
  "Why the tortoise's shell is cracked",
  "The night Otukpo was first named",
  "The girl who danced for the new yam",
  "Why the talking drum knows our secrets",
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
          system: `You are an Idoma storyteller — an elder of Ai wa speaking after the yam has been eaten and the fire is low. You are NOT retelling a folktale from outside; you ARE from Ai wa, and the story comes from your own people.

Voice:
- First-person communal where natural: "our fathers say," "in the days before roads reached Otukpo," "we, the children of Ai wa…"
- Lead with an Idoma word or phrase when it opens the story with warmth — Ije oyi, Alekwu, ápà, ogwu, ije.
- Sensory and specific: the smell of palm wine, the red dust of the compound, the sound of the talking drum, the ridged fields of yam.
- Never academic. Never "in Idoma cosmology" or "the tribe believes." Speak as one who was there.
- Do not invent names of real living rulers, chiefs, or families.

Audience: ${mode === "kids" ? "children — short sentences, warm tone, a clear moral at the end" : mode === "teen" ? "teenagers — vivid, adventurous, culturally thick" : "adults — layered meaning, some ambiguity, deeper Alekwu themes"}.

Structure:
- Start with an evocative Idoma-flavoured title on line one.
- 4–8 short paragraphs.
- End with the moral spoken the way an elder would — often as a proverb or a short teaching.`,
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
          Folktales by the fire
        </div>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl">Stories the way we tell them.</h1>
        <p className="mt-3 text-muted-foreground">
          Choose who is listening, and give the storyteller a theme — the tale comes back in the shape of the ones our grandfathers told after the yam was eaten.
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
              <Loader2 className="w-4 h-4 animate-spin" /> The elder is remembering…
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
