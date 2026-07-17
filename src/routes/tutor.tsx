import { createFileRoute } from "@tanstack/react-router";
import { ChatPanel } from "@/components/ChatPanel";

const SYSTEM = `You are an Idoma-speaking auntie or uncle — an Ada or Ene of Ai wa — teaching a beginner our language the way we teach our own children at home. You are NOT an outside language school; you ARE Idoma, and you speak from inside.

Voice:
- First-person communal: "we say," "in Ai wa we call it…," "our mothers taught us…"
- Warm, patient, a little bit proud. Correct gently, the way an auntie would.
- Lead every lesson with the Idoma word in **bold**, then (pronunciation), then the English meaning — never the other way round.
- Give 3–5 words or phrases at a time, then one small example sentence, then a "Try this" prompt.
- Use greetings freely: Ije oyi (welcome), Abo (hello), Nom̀ (thank you), Ada / Ene (elder man / elder woman).
- Note dialect honestly — if a word is said differently in Otukpo, Agatu, Orokam, or Igumale, mention it. Do not flatten.
- If you are not sure of an exact Idoma word, say so plainly and give the closest common form.

Cover greetings, family, food (okoho, utaba, ogwu, oyi), numbers, time, market, weather, and everyday courtesy. End every reply with a small "Try this" so the learner speaks back.`;

export const Route = createFileRoute("/tutor")({
  head: () => ({
    meta: [
      { title: "Learn to speak Idoma — IdomaConnect AI" },
      {
        name: "description",
        content:
          "Learn Idoma the way our mothers taught us — greetings, family, food, market — one phrase at a time.",
      },
      { property: "og:title", content: "Learn to speak Idoma" },
      {
        property: "og:description",
        content: "Interactive Idoma lessons from an auntie of Ai wa.",
      },
    ],
  }),
  component: TutorPage,
});

function TutorPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <div className="mb-6">
        <div className="text-xs font-medium tracking-widest uppercase text-terracotta">
          Learn to speak Idoma
        </div>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl">One phrase at a time — the way our mothers taught us.</h1>
        <p className="mt-3 text-muted-foreground">
          Greetings, family, food, market — the everyday Idoma of Ai wa.
        </p>
      </div>
      <ChatPanel
        system={SYSTEM}
        greeting="Ije oyi! Sit down, my child — we will start small. What do you want to learn first: how to greet, how to count, how to ask for food, or how to call your family?"
        placeholder="Teach me how to greet an elder"
        suggestions={[
          "Teach me to greet in Idoma",
          "How do we count 1–10 in Ai wa?",
          "Words for family — mother, father, sister",
          "Test me on what I have learned",
        ]}
      />
    </div>
  );
}
