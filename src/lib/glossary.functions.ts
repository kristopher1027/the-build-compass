import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { listApprovedGlossary } from "@/lib/glossary.server";

const GlossaryInput = z
  .object({
    id: z.string().uuid().optional(),
    english_term: z.string().trim().min(1).max(160),
    yoruba_term: z.string().trim().max(160),
    idoma_term: z.string().trim().max(160),
    dialect_notes: z.string().trim().max(2000),
    example_english: z.string().trim().max(1000),
    example_yoruba: z.string().trim().max(1000),
    example_idoma: z.string().trim().max(1000),
    source_name: z.string().trim().max(200),
    source_license: z.string().trim().max(500),
    reviewer: z.string().trim().max(160),
    is_approved: z.boolean(),
  })
  .refine((entry) => entry.yoruba_term.length > 0 || entry.idoma_term.length > 0, {
    message: "Add a Yoruba or Idoma term.",
  });

const GlossaryId = z.object({ id: z.string().uuid() });

type AdminContext = {
  supabase: import("@supabase/supabase-js").SupabaseClient<Database>;
  userId: string;
};

async function assertAdmin({ supabase, userId }: AdminContext) {
  const { data, error } = await supabase.rpc("has_role", {
    _user_id: userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Administrator access required.");
}

export const getApprovedGlossary = createServerFn({ method: "GET" }).handler(async () =>
  listApprovedGlossary(),
);

export const getAdminGlossary = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("translation_glossary")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) throw new Error("Glossary could not be loaded.");
    return data;
  });

export const saveGlossaryEntry = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => GlossaryInput.parse(data))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const values = {
      english_term: data.english_term,
      yoruba_term: data.yoruba_term || null,
      idoma_term: data.idoma_term || null,
      dialect_notes: data.dialect_notes,
      example_english: data.example_english,
      example_yoruba: data.example_yoruba,
      example_idoma: data.example_idoma,
      source_name: data.source_name,
      source_license: data.source_license,
      reviewer: data.reviewer,
      is_approved: data.is_approved,
      updated_by: context.userId,
    };
    if (data.is_approved && (!data.source_name || !data.source_license || !data.reviewer)) {
      throw new Error("Approved entries need a source, license or permission, and reviewer.");
    }

    const result = data.id
      ? await context.supabase.from("translation_glossary").update(values).eq("id", data.id)
      : await context.supabase
          .from("translation_glossary")
          .insert({ ...values, created_by: context.userId });
    if (result.error) throw new Error("Glossary entry could not be saved.");
    return { ok: true };
  });

export const deleteGlossaryEntry = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => GlossaryId.parse(data))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase
      .from("translation_glossary")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error("Glossary entry could not be deleted.");
    return { ok: true };
  });
