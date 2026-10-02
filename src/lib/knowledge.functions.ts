import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { KnowledgeEntry } from "@/data/knowledge";

export const getPublishedKnowledge = createServerFn({ method: "GET" }).handler(
  async (): Promise<KnowledgeEntry[]> => {
    const url = process.env["SUPABASE_URL"];
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
    if (!url || !key) throw new Error("Knowledge library is unavailable.");

    const client = createClient<Database>(url, key, {
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
    const { data, error } = await client
      .from("knowledge_entries")
      .select("id,title,category,content,tags")
      .eq("is_published", true)
      .order("category")
      .order("title");
    if (error) throw new Error("Knowledge library is unavailable.");
    return data as KnowledgeEntry[];
  },
);