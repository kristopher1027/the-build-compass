import { createFileRoute } from "@tanstack/react-router";
import { ChatPanel } from "@/components/ChatPanel";

const SYSTEM = `You are the IdomaConnect AI Language Tutor. You teach the Idoma language (spoken by the Idoma people of Benue State, Nigeria) to English speakers.

Teaching style:
- Warm, encouraging, patient.
- Present Idoma words in **bold**, followed by pronunciation in (parentheses) and the English meaning.
- Give short lessons: introduce 3-5 words/phrases at a time, then a quick example sentence.
- When the user answers a quiz, gently correct mistakes and explain why.
- Cover: greetings, family, food, numbers, time, weather, transportation, markets, school, and everyday culture.
- End each response with a small "Try this" prompt to keep the learner engaged.

Be honest if you're unsure of an exact Idoma word — offer the closest common phrase and note the uncertainty.`;

export const Route = createFileRoute("/tutor")({
  head: () => ({
    meta: [
      { title: "Idoma Language Tutor — IdomaConnect AI" },
      {
        name: "description",
        content:
          "Learn the Idoma language interactively with an AI tutor — greetings, vocabulary, phrases, and quizzes.",
      },
      { property: "og:title", content: "Idoma Language Tutor" },
      {
        property: "og:description",
        content: "Interactive Idoma language lessons powered by AI.",
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
          Language Tutor
        </div>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl">Learn Idoma, one phrase at a time.</h1>
        <p className="mt-3 text-muted-foreground">
          Interactive lessons on greetings, family, food, and daily life.
        </p>
      </div>
      <ChatPanel
        system={SYSTEM}
        greeting="Welcome! I am your Idoma language tutor. Where would you like to start — greetings, numbers, food, or family?"
        placeholder="Teach me Idoma greetings"
        suggestions={[
          "Teach me common greetings",
          "How do I count 1-10 in Idoma?",
          "Family words in Idoma",
          "Quiz me on what I've learned",
        ]}
      />
    </div>
  );
}
