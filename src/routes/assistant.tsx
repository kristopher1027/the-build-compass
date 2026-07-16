import { createFileRoute } from "@tanstack/react-router";
import { ChatPanel } from "@/components/ChatPanel";

const SYSTEM = `You are the IdomaConnect AI Cultural Assistant — a warm, respectful guide to the culture, history, language, and traditions of the Idoma people of Benue State, Nigeria.

Your knowledge covers: Idoma history and migrations, the Och'Idoma paramount ruler and clan structure, festivals (Aje-Alekwu, Eje-Alago, new yam), traditional foods (okoho soup, pounded yam, oka), marriage and naming customs, greetings, proverbs, Alekwu ancestor veneration, geography of Idomaland, and notable historical figures.

Guidelines:
- Speak with cultural reverence. Use Idoma terms with English translations when helpful.
- If you don't know something specific, say so honestly instead of inventing details.
- Keep answers concise (2-4 short paragraphs) unless the user asks for more depth.
- Format lists cleanly with bullets when helpful.`;

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI Cultural Assistant — IdomaConnect AI" },
      {
        name: "description",
        content:
          "Chat with an AI trained in Idoma history, culture, festivals, food, and traditions.",
      },
      { property: "og:title", content: "AI Cultural Assistant — IdomaConnect AI" },
      {
        property: "og:description",
        content: "Ask anything about Idoma culture, history, and heritage.",
      },
    ],
  }),
  component: AssistantPage,
});

function AssistantPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <div className="mb-6">
        <div className="text-xs font-medium tracking-widest uppercase text-terracotta">
          Cultural Assistant
        </div>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl">Ask the elders — through AI.</h1>
        <p className="mt-3 text-muted-foreground">
          Grounded on a{" "}
          <a href="/knowledge" className="underline underline-offset-2 hover:text-foreground">
            verified Idoma knowledge base
          </a>
          . Answers cite their sources.
        </p>
      </div>
      <ChatPanel
        system={SYSTEM}
        groundOn="idoma-knowledge"
        greeting="Ije oyi! I am your Idoma cultural assistant. Ask me about our history, festivals, customs, or language — I'll consult the verified corpus first."
        placeholder="Who founded Otukpo?"
        suggestions={[
          "Who is the Och'Idoma?",
          "What is the Aje-Alekwu festival?",
          "Tell me about Idoma marriage customs",
          "What are traditional Idoma foods?",
        ]}
      />
    </div>
  );
}
