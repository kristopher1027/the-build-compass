ALTER TABLE public.knowledge_entries
  DROP CONSTRAINT knowledge_entries_category_check;

ALTER TABLE public.knowledge_entries
  ADD CONSTRAINT knowledge_entries_category_check
  CHECK (category IN ('History','Rulers','Clans','LGAs','Festivals','Proverbs','Greetings','Tourist Sites','Businesses','Cultural Practices'));