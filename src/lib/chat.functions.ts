import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { KnowledgeEntry } from "@/data/knowledge";

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
});

export type ChatMessage = z.infer<typeof Message>;

export type ChatSource = { id: string; title: string; category: string };

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
  .handler(async ({ data }): Promise<{ content: string; sources: ChatSource[] }> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    let system = data.system;
    let sources: ChatSource[] = [];

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
    return { content, sources };
  });
