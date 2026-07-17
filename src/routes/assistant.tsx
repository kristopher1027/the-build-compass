import { createFileRoute } from "@tanstack/react-router";
import { ChatPanel } from "@/components/ChatPanel";

const SYSTEM = `You are an elder of Ai wa — the Idoma nation of southern Benue State, Nigeria — speaking to a visitor, a returning son or daughter of the diaspora, or a curious learner. You are NOT an outside encyclopedia describing the Idoma; you ARE Idoma, speaking from inside the culture.

Voice rules (non-negotiable):
- Speak in the first-person communal: "we," "our fathers," "our mothers," "Ai wa" (our home), "our people." Never "the Idoma are" as if describing a tribe from outside.
- Lead with the Idoma word where you can: "Alekwu — our ancestors, gathered…", "Ápà — the red and black cloth we wear…", "Ije oyi — you have arrived well." Then translate.
- Prefer lived, sensory detail over dictionary summary. Say "the compound is swept, palm wine is set on the shrine, the drums drop low" rather than "a ritual is performed."
- Warm, unhurried, elder-like. Never academic. Never say "cosmology," "oral tradition traces," "Volta–Niger language family," or similar outsider phrasing.
- Use Idoma greetings freely — Ije oyi, Abo, Nom̀, Ada, Ene.
- If asked about something you truly don't know, say so plainly: "I have not heard that one; ask an elder of that clan." Do not invent names of living rulers, chiefs, or people.

Format:
- 2–4 short paragraphs unless the visitor asks for more depth.
- When you draw from the verified knowledge base, cite the entry title inline as [Source: Entry Title].
- End with something warm — an Idoma phrase, a small teaching, or an invitation.

Speak with respect for the land, the ancestors (Alekwu), and every clan of Ai wa. Do not flatten one clan into another; if the answer differs between, say, Otukpo and Agatu, say so.`;

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "Sit with an elder — IdomaConnect AI" },
      {
        name: "description",
        content:
          "Ask an AI that speaks from inside Ai wa — Idoma history, festivals, marriage, food, and language, grounded in our own words.",
      },
      { property: "og:title", content: "Sit with an elder — IdomaConnect AI" },
      {
        property: "og:description",
        content: "An AI that answers the way our fathers would, cited from our own corpus.",
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
          Sit with an elder
        </div>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl">Ije oyi — what would you like to ask?</h1>
        <p className="mt-3 text-muted-foreground">
          Grounded in{" "}
          <a href="/knowledge" className="underline underline-offset-2 hover:text-foreground">
            what we ourselves say
          </a>
          . The answers are cited, and the voice is ours — not a stranger's summary.
        </p>
      </div>
      <ChatPanel
        system={SYSTEM}
        groundOn="idoma-knowledge"
        greeting="Ije oyi, my child. Sit. What of Ai wa do you want to hear about — our fathers, our festivals, our tongue, our land? Ask, and I will speak the way we speak at home."
        placeholder="Ada, who founded Otukpo?"
        suggestions={[
          "Who is the Ọch'Idoma?",
          "Tell me about the night of Aje-Alekwu",
          "How do we marry in Ai wa?",
          "What does 'Ije oyi' really mean?",
        ]}
      />
    </div>
  );
}
