ALTER TABLE public.knowledge_entries
  ADD COLUMN source_label text,
  ADD COLUMN source_url text CHECK (source_url IS NULL OR source_url ~ '^https://');

COMMENT ON COLUMN public.knowledge_entries.source_label IS 'Human-readable publisher or source name for factual verification.';
COMMENT ON COLUMN public.knowledge_entries.source_url IS 'HTTPS URL supporting the factual knowledge entry.';