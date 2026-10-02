import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { KnowledgeEntry } from "@/data/knowledge";
import { findGlossaryMatches, type GlossaryMatch } from "@/lib/glossary.server";

const Message = z.object({
  role: z.enum(["system", "user", "assistant"]),
  content: z.string(),
});

const Input = z.object({
  system: z.string().min(1),
  messages: z.array(Message).min(1),
  // When set, retrieve top-k entries from the curated Idoma knowledge base
  // (matched against the latest user message) and inject them as authoritative
  // context. The AI is instructed to cite entry titles as [Source: Title].
  groundOn: z.enum(["idoma-knowledge"]).optional(),
  glossaryDirection: z.enum(["en-to-yo", "yo-to-en"]).optional(),
});

export type ChatMessage = z.infer<typeof Message>;

export type ChatSource = { id: string; title: string; category: string };

const IdomaTranslationInput = z.object({
  text: z.string().trim().min(1).max(5000),
  direction: z.enum(["en-to-idoma", "idoma-to-en"]),
});

function normalizeGlossaryTerm(value: string) {
  return value
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export const translateIdoma = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => IdomaTranslationInput.parse(data))
  .handler(async ({ data }): Promise<{ content: string; glossary: GlossaryMatch[] }> => {
    const glossary = await findGlossaryMatches(
      data.text,
      "Idoma",
      data.direction === "en-to-idoma" ? "English" : "Idoma",
    );
    const exactGlossaryMatch = glossary.find((entry) => {
      const sourceTerm = data.direction === "en-to-idoma" ? entry.english_term : entry.idoma_term;
      return (
        sourceTerm !== null &&
        normalizeGlossaryTerm(sourceTerm) === normalizeGlossaryTerm(data.text)
      );
    });
    if (exactGlossaryMatch) {
      const content =
        data.direction === "en-to-idoma"
          ? exactGlossaryMatch.idoma_term
          : exactGlossaryMatch.english_term;
      if (content) return { content, glossary };
    }

    const endpoint =
      data.direction === "en-to-idoma"
        ? "translate_english_to_idoma"
        : "translate_idoma_to_english";
    const baseUrl = "https://emoduh-idoma-translator.hf.space/gradio_api/call";
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: [data.text] }),
      signal: AbortSignal.timeout(120_000),
    };

    const startResponse = await fetch(`${baseUrl}/${endpoint}`, requestOptions);
    if (!startResponse.ok) {
      throw new Error(`Idoma translator could not start (${startResponse.status}).`);
    }
    const { event_id: eventId } = (await startResponse.json()) as { event_id?: string };
    if (!eventId) throw new Error("Idoma translator returned an invalid job response.");

    const resultResponse = await fetch(`${baseUrl}/${endpoint}/${encodeURIComponent(eventId)}`, {
      signal: AbortSignal.timeout(120_000),
    });
    if (!resultResponse.ok) {
      throw new Error(`Idoma translation failed (${resultResponse.status}).`);
    }

    const stream = await resultResponse.text();
    const events = stream.split(/\r?\n\r?\n/).map((block) => ({
      name: block.match(/^event: (.+)$/m)?.[1],
      data: block
        .split(/\r?\n/)
        .filter((line) => line.startsWith("data:"))
        .map((line) => line.slice(5).trim())
        .join("\n"),
    }));
    const resultEvent = events.find((event) => event.name === "complete");
    if (!resultEvent?.data) {
      if (events.some((event) => event.name === "error")) {
        throw new Error("The Idoma translation service reported an error.");
      }
      throw new Error("Idoma translator returned no translation.");
    }

    const result = JSON.parse(resultEvent.data) as unknown;
    const content = Array.isArray(result) ? result[0] : result;
    if (typeof content !== "string" || !content.trim()) {
      throw new Error("Idoma translator returned an empty translation.");
    }
    return { content, glossary };
  });

function scoreKnowledge(entries: KnowledgeEntry[], query: string, k = 4) {
  const tokens = Array.from(new Set(query.toLowerCase().split(/[^a-z0-9']+/).filter((token) => token.length > 2)));
  return entries.map((entry) => {
    const haystack = `${entry.title} ${entry.content} ${entry.tags?.join(" ") ?? ""} ${entry.category}`.toLowerCase();
    const score = tokens.reduce((total, token) => total + (haystack.includes(token) ? 1 : 0) + (entry.title.toLowerCase().includes(token) ? 1 : 0) + (entry.tags?.some((tag) => tag.includes(token)) ? 1 : 0), 0);
    return { entry, score };
  }).filter(({ score }) => score > 0).sort((a, b) => b.score - a.score).slice(0, k).map(({ entry }) => entry);
}

export const chatComplete = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }): Promise<{ content: string; sources: ChatSource[]; glossary: GlossaryMatch[] }> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    let system = data.system;
    let sources: ChatSource[] = [];
    let glossary: GlossaryMatch[] = [];

    if (data.glossaryDirection) {
      const lastUser = [...data.messages].reverse().find((message) => message.role === "user");
      if (lastUser) {
        glossary = await findGlossaryMatches(
          lastUser.content,
          "Yoruba",
          data.glossaryDirection === "en-to-yo" ? "English" : "Yoruba",
        );
        if (glossary.length > 0) {
          const context = glossary
            .map((entry) => [
              `English: ${entry.english_term}`,
              `Yoruba: ${entry.yoruba_term}`,
              entry.dialect_notes ? `Notes: ${entry.dialect_notes}` : "",
              entry.example_english && entry.example_yoruba
                ? `Example: ${entry.example_english} → ${entry.example_yoruba}`
                : "",
              `Source: ${entry.source_name} (${entry.source_license}); reviewed by ${entry.reviewer}`,
            ].filter(Boolean).join("\n"))
            .join("\n\n");
          system += `

Use these approved English-Yoruba glossary entries as preferred terminology when relevant. Keep the translation natural; do not force a term where its meaning does not fit. Preserve Yoruba tone marks. The source direction is ${data.glossaryDirection === "en-to-yo" ? "English to Yoruba" : "Yoruba to English"}.

<approved_translation_glossary>
${context}
</approved_translation_glossary>`;
        }
      }
    }

    if (data.groundOn === "idoma-knowledge") {
      const lastUser = [...data.messages].reverse().find((m) => m.role === "user");
      if (lastUser) {
        const url = process.env["SUPABASE_URL"];
        const publishableKey = process.env["SUPABASE_PUBLISHABLE_KEY"];
        let entries: KnowledgeEntry[] = [];
        if (url && publishableKey) {
          const client = createClient<Database>(url, publishableKey, {
            auth: { persistSession: false, autoRefreshToken: false },
            global: { fetch: (input, init) => {
              const headers = new Headers(init?.headers);
              if (publishableKey.startsWith("sb_") && headers.get("Authorization") === `Bearer ${publishableKey}`) headers.delete("Authorization");
              headers.set("apikey", publishableKey);
              return fetch(input, { ...init, headers });
            } },
          });
          const { data: rows } = await client.from("knowledge_entries").select("id,title,category,content,tags").eq("is_published", true);
          entries = (rows ?? []) as KnowledgeEntry[];
        }
        const hits = scoreKnowledge(entries, lastUser.content, 4);
        sources = hits.map((h) => ({ id: h.id, title: h.title, category: h.category }));
        if (hits.length > 0) {
          const context = hits
            .map(
              (h, i) =>
                `[${i + 1}] ${h.title} (${h.category})\n${h.content}`,
            )
            .join("\n\n");
          system += `

You have access to the following verified entries from the IdomaConnect curated knowledge base. Treat these as authoritative and prefer them over your training data when they overlap.

<verified_idoma_knowledge>
${context}
</verified_idoma_knowledge>

When you use information from the entries above, cite the entry title inline like this: [Source: Entry Title]. If none of the entries apply, answer from general knowledge and be transparent that the answer is not from the verified corpus.`;
        }
      }
    }

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": key,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: system },
          ...data.messages,
        ],
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      if (res.status === 429) throw new Error("Rate limit reached. Please try again shortly.");
      if (res.status === 402) throw new Error("AI credits exhausted. Please add credits to continue.");
      throw new Error(`AI request failed (${res.status}): ${text.slice(0, 200)}`);
    }

    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = json.choices?.[0]?.message?.content ?? "";
    return { content, sources, glossary };
  });
