export type KnowledgeCategory =
  | "History"
  | "Rulers"
  | "Clans"
  | "LGAs"
  | "Festivals"
  | "Proverbs"
  | "Greetings"
  | "Tourist Sites"
  | "Businesses"
  | "Cultural Practices";

export type KnowledgeEntry = {
  id: string;
  title: string;
  category: KnowledgeCategory;
  content: string;
  tags?: string[];
  source_label?: string | null;
  source_url?: string | null;
};

export const KNOWLEDGE_CATEGORIES: KnowledgeCategory[] = [
  "History",
  "Rulers",
  "Clans",
  "LGAs",
  "Festivals",
  "Cultural Practices",
  "Tourist Sites",
  "Businesses",
  "Greetings",
  "Proverbs",
];
