import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type GlossaryEntry = Database["public"]["Tables"]["translation_glossary"]["Row"];
export type GlossaryMatch = Pick<
  GlossaryEntry,
  | "english_term"
  | "yoruba_term"
  | "idoma_term"
  | "dialect_notes"
  | "example_english"
  | "example_yoruba"
  | "example_idoma"
  | "source_name"
  | "source_license"
  | "reviewer"
>;

function createPublicClient() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) return null;

  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

export async function listApprovedGlossary(): Promise<GlossaryEntry[]> {
  const client = createPublicClient();
  if (!client) return [];

  const { data, error } = await client
    .from("translation_glossary")
    .select("*")
    .eq("is_approved", true)
    .order("english_term")
    .limit(1000);
  if (error) return [];
  return data;
}

function normalize(value: string) {
  return value
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export async function findGlossaryMatches(
  query: string,
  language: "Yoruba" | "Idoma",
  sourceLanguage: "English" | "Yoruba" | "Idoma" = "English",
  limit = 8,
): Promise<GlossaryMatch[]> {
  const entries = await listApprovedGlossary();
  const normalizedQuery = ` ${normalize(query)} `;
  const queryWords = new Set(
    normalizedQuery
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 2),
  );

  return entries
    .map((entry) => {
      if (language === "Yoruba" ? !entry.yoruba_term : !entry.idoma_term) {
        return { entry, score: 0 };
      }
      const sourceTerm =
        sourceLanguage === "Yoruba"
          ? entry.yoruba_term
          : sourceLanguage === "Idoma"
            ? entry.idoma_term
            : entry.english_term;
      const term = normalize(sourceTerm ?? "");
      if (!term) return { entry, score: 0 };
      const phraseMatch = normalizedQuery.includes(` ${term} `);
      const termWords = term.split(" ").filter((word) => word.length > 2);
      const wordMatches = termWords.filter((word) => queryWords.has(word)).length;
      const score = phraseMatch ? termWords.length + 3 : wordMatches;
      return { entry, score };
    })
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .map(({ entry }) => ({
      english_term: entry.english_term,
      yoruba_term: entry.yoruba_term,
      idoma_term: entry.idoma_term,
      dialect_notes: entry.dialect_notes,
      example_english: entry.example_english,
      example_yoruba: entry.example_yoruba,
      example_idoma: entry.example_idoma,
      source_name: entry.source_name,
      source_license: entry.source_license,
      reviewer: entry.reviewer,
    }));
}
