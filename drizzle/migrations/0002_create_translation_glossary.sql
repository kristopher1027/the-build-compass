CREATE TABLE public.translation_glossary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  english_term text NOT NULL CHECK (char_length(english_term) BETWEEN 1 AND 160),
  yoruba_term text CHECK (yoruba_term IS NULL OR char_length(yoruba_term) <= 160),
  idoma_term text CHECK (idoma_term IS NULL OR char_length(idoma_term) <= 160),
  dialect_notes text NOT NULL DEFAULT '',
  example_english text NOT NULL DEFAULT '',
  example_yoruba text NOT NULL DEFAULT '',
  example_idoma text NOT NULL DEFAULT '',
  source_name text NOT NULL DEFAULT '',
  source_license text NOT NULL DEFAULT '',
  reviewer text NOT NULL DEFAULT '',
  is_approved boolean NOT NULL DEFAULT false,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT translation_glossary_has_translation CHECK (yoruba_term IS NOT NULL OR idoma_term IS NOT NULL),
  CONSTRAINT translation_glossary_approval_has_provenance CHECK (NOT is_approved OR (char_length(trim(source_name)) > 0 AND char_length(trim(source_license)) > 0 AND char_length(trim(reviewer)) > 0))
);

CREATE INDEX translation_glossary_approved_updated_idx ON public.translation_glossary (is_approved, updated_at DESC);
GRANT SELECT ON public.translation_glossary TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.translation_glossary TO authenticated;
GRANT ALL ON public.translation_glossary TO service_role;
ALTER TABLE public.translation_glossary ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Approved glossary is public" ON public.translation_glossary FOR SELECT TO anon USING (is_approved = true);
CREATE POLICY "Members read approved glossary and admins read all" ON public.translation_glossary FOR SELECT TO authenticated USING (is_approved = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Administrators add glossary entries" ON public.translation_glossary FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin') AND created_by = auth.uid() AND updated_by = auth.uid());
CREATE POLICY "Administrators edit glossary entries" ON public.translation_glossary FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin') AND updated_by = auth.uid());
CREATE POLICY "Administrators remove glossary entries" ON public.translation_glossary FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER translation_glossary_set_updated_at BEFORE UPDATE ON public.translation_glossary FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();