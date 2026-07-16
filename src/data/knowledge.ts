export type KnowledgeCategory =
  | "History"
  | "Rulers"
  | "Clans"
  | "LGAs"
  | "Festivals"
  | "Proverbs"
  | "Greetings"
  | "Tourist Sites"
  | "Cultural Practices";

export type KnowledgeEntry = {
  id: string;
  title: string;
  category: KnowledgeCategory;
  content: string;
  tags?: string[];
};

export const KNOWLEDGE: KnowledgeEntry[] = [
  // ---------- History ----------
  {
    id: "origin-apa",
    title: "Idoma origins and the Apa migration",
    category: "History",
    content:
      "Idoma oral tradition traces the people's origins to Apa, an ancient Kwararafa/Jukun-related polity in the middle Benue valley. Following the collapse of Apa around the 17th–18th centuries, groups migrated southward and settled across what is now southern Benue State, forming the clans that make up modern Idomaland.",
    tags: ["apa", "kwararafa", "migration", "jukun", "origins"],
  },
  {
    id: "colonial-era",
    title: "Colonial contact and administrative reorganization",
    category: "History",
    content:
      "British colonial administration reached Idomaland in the early 20th century, grouping the clans under the Idoma Native Authority in 1927 with headquarters at Otukpo. This laid the groundwork for the unified Idoma identity and the creation of the paramount stool of the Och'Idoma in 1948.",
    tags: ["colonial", "1927", "1948", "native authority", "otukpo"],
  },
  {
    id: "benue-state",
    title: "Idoma within Benue State",
    category: "History",
    content:
      "Benue State was created on 3 February 1976. The Idoma occupy the southern zone of the state (Zone C), while the Tiv occupy the northern and central zones. Idomaland spans roughly nine local government areas.",
    tags: ["benue", "1976", "zone c", "tiv"],
  },

  // ---------- Rulers ----------
  {
    id: "och-idoma",
    title: "The Och'Idoma — paramount ruler",
    category: "Rulers",
    content:
      "The Och'Idoma is the paramount traditional ruler of the Idoma nation, seated at the palace in Otukpo. The stool was established in 1948 to unify the clans. Notable holders include Ogiri Oko (the first, 1948–1960), Ajene Okpabi, Abraham Ajene Okpabi, Elias Ikoyi Obekpa, and Agabaidu Elaigwu Odogbo John. As of recent installations the reigning Och'Idoma is Agabaidu Prof. John Elaigwu Odogbo.",
    tags: ["och'idoma", "ochidoma", "paramount", "otukpo", "agabaidu"],
  },
  {
    id: "clan-chiefs",
    title: "Clan-level traditional rulers",
    category: "Rulers",
    content:
      "Each Idoma clan has its own traditional ruler, referred to variously as Och'Ai (chief of a district) or by clan-specific titles such as Ad'Ojira, Och'Otukpo, Och'Ugbokolo, Och'Igumale, and others. These chiefs form the Idoma Traditional Council under the Och'Idoma.",
    tags: ["och'ai", "council", "clan chief"],
  },

  // ---------- Clans ----------
  {
    id: "clan-list",
    title: "Major Idoma clans",
    category: "Clans",
    content:
      "The Idoma people are organised into clans (Ai). Major clans include Otukpo (Otukpa), Adoka, Igumale, Ugbokolo, Orokam, Ochekwu, Ai-Ono, Edumoga, Ejigbo, Ito, Igede-related border clans, Agatu, and Apa. Each clan has its own dialect variations, festivals, and ancestral shrines.",
    tags: ["clans", "ai", "otukpo", "adoka", "igumale", "orokam", "agatu"],
  },
  {
    id: "clan-agatu",
    title: "Agatu clan",
    category: "Clans",
    content:
      "The Agatu occupy the northwestern edge of Idomaland along the River Benue. They are known for river-fishing traditions, rice farming, and a distinct dialect of Idoma. Agatu LGA has its headquarters at Obagaji.",
    tags: ["agatu", "obagaji", "river benue"],
  },

  // ---------- LGAs ----------
  {
    id: "lgas",
    title: "Idoma local government areas",
    category: "LGAs",
    content:
      "The Idoma-speaking LGAs of Benue State are: Otukpo, Ohimini, Okpokwu, Ogbadibo, Ado, Apa, Agatu, Obi, and parts of Oju/Ohinini. Otukpo is the cultural and administrative headquarters and the largest urban area.",
    tags: ["lga", "otukpo", "ohimini", "okpokwu", "ogbadibo", "ado", "apa", "agatu", "obi"],
  },

  // ---------- Festivals ----------
  {
    id: "aje-alekwu",
    title: "Aje-Alekwu festival",
    category: "Festivals",
    content:
      "Aje-Alekwu is the ancestral veneration festival honouring Alekwu — the collective spirit of departed ancestors. Held annually in the dry season, it features masquerade performances, drumming, offerings of yam and palm wine, and communal feasting. It reinforces intergenerational moral order.",
    tags: ["alekwu", "ancestors", "masquerade", "aje"],
  },
  {
    id: "eje-alago",
    title: "Eje-Alago post-harvest festival",
    category: "Festivals",
    content:
      "Eje-Alago is a thanksgiving festival celebrated after the main harvest. Communities gather for wrestling contests (ije), traditional dances, and the sharing of new crops. Young men compete for honour on behalf of their villages.",
    tags: ["eje", "harvest", "wrestling", "ije"],
  },
  {
    id: "ito-ogwu",
    title: "Ito Ogwu — new yam festival",
    category: "Festivals",
    content:
      "Ito Ogwu marks the ritual eating of new yams. Yam (ogwu) is central to Idoma cosmology as a symbol of prosperity, and no one traditionally eats the new yam before this festival is performed. Timing varies by clan.",
    tags: ["ito ogwu", "new yam", "ogwu", "harvest"],
  },

  // ---------- Proverbs ----------
  {
    id: "proverb-elephant",
    title: "Proverb: unity",
    category: "Proverbs",
    content:
      "\"Onyi na onyi ka wa ta enya\" — 'One person and one person make two.' Used to teach that cooperation and unity multiply strength.",
    tags: ["proverb", "unity"],
  },
  {
    id: "proverb-patience",
    title: "Proverb: patience",
    category: "Proverbs",
    content:
      "\"Owo ka i chogba, i ga leyi kpai\" — 'The hand that does not hurry will eat well.' A teaching on patience and deliberate action.",
    tags: ["proverb", "patience"],
  },

  // ---------- Greetings ----------
  {
    id: "greetings-basic",
    title: "Common Idoma greetings",
    category: "Greetings",
    content:
      "Ije oyi — 'Welcome' (literally, 'you have arrived well'). Abo — 'Hello / greetings'. Nom̀ — 'Thank you'. Ada nwu? — 'How are you?'. Idoma greetings emphasise arrival, well-being, and respect for elders.",
    tags: ["greeting", "hello", "welcome", "thank you", "ije oyi", "abo"],
  },
  {
    id: "greetings-elders",
    title: "Addressing elders",
    category: "Greetings",
    content:
      "Elders are addressed with respect prefixes: Ada (father/senior man), Ene (mother/senior woman). Younger people bow slightly and use both hands when receiving items from an elder.",
    tags: ["elder", "ada", "ene", "respect"],
  },

  // ---------- Tourist Sites ----------
  {
    id: "otukpo-town",
    title: "Otukpo — cultural capital",
    category: "Tourist Sites",
    content:
      "Otukpo is the cultural heart of Idomaland and hosts the palace of the Och'Idoma. It is the largest Idoma urban centre and the site of major cultural gatherings and the annual Idoma Day.",
    tags: ["otukpo", "palace", "capital"],
  },
  {
    id: "ojira-hills",
    title: "Ojira Hills",
    category: "Tourist Sites",
    content:
      "Rolling savanna hills in Ohimini LGA dotted with ancestral shrines and traditional farmsteads. Considered a spiritual landscape.",
    tags: ["ojira", "hills", "ohimini"],
  },
  {
    id: "ogbadibo-caves",
    title: "Ogbadibo Caves",
    category: "Tourist Sites",
    content:
      "Ancient sandstone caves in Ogbadibo LGA said to have sheltered ancestors during migrations. Referenced in the oral history of several clans.",
    tags: ["caves", "ogbadibo", "migration"],
  },

  // ---------- Cultural Practices ----------
  {
    id: "alekwu",
    title: "Alekwu — ancestor veneration",
    category: "Cultural Practices",
    content:
      "Alekwu is the collective spirit of Idoma ancestors and the central pillar of traditional Idoma spirituality. Alekwu is invoked at family shrines, moral disputes, and community festivals; masquerades represent Alekwu's presence among the living.",
    tags: ["alekwu", "ancestors", "religion", "masquerade"],
  },
  {
    id: "marriage",
    title: "Traditional marriage",
    category: "Cultural Practices",
    content:
      "Idoma marriage involves several stages: introduction (ilo ọ́la), bride-price negotiation between family elders, presentation of drinks and kola, and the wedding proper with dancing and gift-giving. Both extended families are heavily involved.",
    tags: ["marriage", "bride price", "wedding", "kola"],
  },
  {
    id: "foods",
    title: "Idoma foods",
    category: "Cultural Practices",
    content:
      "Signature Idoma dishes include okoho soup (a stretchy vegetable soup made from okoho bark), pounded yam (utaba), oka (maize-based dough), egwusi soup, bushmeat stews, and palm wine (oyi). Yam remains the prestige crop.",
    tags: ["food", "okoho", "pounded yam", "utaba", "oka", "palm wine"],
  },
  {
    id: "dress",
    title: "Traditional dress",
    category: "Cultural Practices",
    content:
      "The iconic Idoma cloth is a red-and-black woven fabric (ápà) worn wrapped around the waist for men and as a full garment for women during ceremonies. Coral beads and cowrie ornaments accompany chieftaincy attire.",
    tags: ["dress", "cloth", "red and black", "apa", "beads"],
  },
  {
    id: "language",
    title: "Idoma language",
    category: "Cultural Practices",
    content:
      "Idoma is a Volta–Niger (Idomoid) language of the Benue–Congo family, spoken by roughly 3–4 million people. It is tonal, with three tones (high, mid, low). Major dialects include Otukpo, Adoka, Agatu, Igumale, and Orokam.",
    tags: ["language", "tonal", "idomoid", "benue-congo", "dialect"],
  },
];

// Simple keyword scorer for grounding retrieval.
// Returns the top-k entries most relevant to the query.
export function retrieveKnowledge(query: string, k = 4): KnowledgeEntry[] {
  const q = query.toLowerCase();
  const tokens = Array.from(new Set(q.split(/[^a-z0-9']+/).filter((t) => t.length > 2)));
  if (tokens.length === 0) return [];

  const scored = KNOWLEDGE.map((entry) => {
    const hay = `${entry.title} ${entry.content} ${(entry.tags ?? []).join(" ")} ${entry.category}`.toLowerCase();
    let score = 0;
    for (const t of tokens) {
      if (hay.includes(t)) score += 1;
      // Title/tag matches count extra.
      if (entry.title.toLowerCase().includes(t)) score += 1;
      if ((entry.tags ?? []).some((tag) => tag.includes(t))) score += 1;
    }
    return { entry, score };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);

  return scored.map((s) => s.entry);
}

export const KNOWLEDGE_CATEGORIES: KnowledgeCategory[] = [
  "History",
  "Rulers",
  "Clans",
  "LGAs",
  "Festivals",
  "Cultural Practices",
  "Tourist Sites",
  "Greetings",
  "Proverbs",
];
