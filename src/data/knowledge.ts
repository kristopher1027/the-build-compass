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

// Voice note: these entries are written from inside Ai wa — first-person
// communal ("we," "our fathers," "Ai wa"), leading with the Idoma word,
// and preferring lived detail over dictionary summary.
export const KNOWLEDGE: KnowledgeEntry[] = [
  // ---------- History ----------
  {
    id: "origin-apa",
    title: "Apa — where we came from",
    category: "History",
    content:
      "Our fathers say we came from Apa, a great kingdom that once stood in the middle Benue valley — kin to the Jukun and Kwararafa. When Apa fell, the clans scattered south, following the rivers, and settled the land we now call Ai wa (our home). Every Idoma child, no matter the clan, will hear at some point: 'wa lù Apa' — 'we come from Apa.'",
    tags: ["apa", "kwararafa", "migration", "jukun", "origins", "ai wa"],
  },
  {
    id: "colonial-era",
    title: "When the British came",
    category: "History",
    content:
      "The white men reached our clans in the early 1900s. In 1927 they bundled us under one 'Idoma Native Authority' with the headquarters at Otukpo — that was the first time all our clans answered to one desk. It was not our idea, but it is what allowed us, twenty years later in 1948, to raise up one stool: the Ọch'Idoma.",
    tags: ["colonial", "1927", "1948", "native authority", "otukpo"],
  },
  {
    id: "benue-state",
    title: "Ai wa inside Benue",
    category: "History",
    content:
      "Benue State was carved out on the 3rd of February, 1976. We — the Idoma — sit in the south, what the state calls Zone C; our Tiv brothers hold the north and centre. When people talk of 'southern Benue,' they are talking of us: roughly nine local governments, one language with many dialects, one people.",
    tags: ["benue", "1976", "zone c", "tiv"],
  },

  // ---------- Rulers ----------
  {
    id: "och-idoma",
    title: "Ọch'Idoma — the one stool of Ai wa",
    category: "Rulers",
    content:
      "The Ọch'Idoma is our paramount father, seated at Otukpo. We raised the stool in 1948 so the clans could speak with one mouth. The first was Ogiri Oko (1948–1960); after him came Ajene Okpabi, Abraham Ajene Okpabi, Elias Ikoyi Obekpa, and today Agabaidu Prof. John Elaigwu Odogbo sits on it. We call him Agabaidu — 'the great one.'",
    tags: ["och'idoma", "ochidoma", "paramount", "otukpo", "agabaidu"],
  },
  {
    id: "clan-chiefs",
    title: "Ọch'Ai — the chief of each clan",
    category: "Rulers",
    content:
      "Before the Ọch'Idoma, we already had our own — Ọch'Otukpo, Ọch'Ugbokolo, Ọch'Igumale, Ad'Ojira, and so on, one for each clan. These are the men who sit in council under the Ọch'Idoma. When a chief speaks in his own clan, his word is enough; when the whole of Ai wa must decide, they gather at Otukpo.",
    tags: ["och'ai", "council", "clan chief"],
  },

  // ---------- Clans ----------
  {
    id: "clan-list",
    title: "The clans of Ai wa",
    category: "Clans",
    content:
      "We are one people, but we are many clans (Ai). The big names you will hear are Otukpo, Adoka, Igumale, Ugbokolo, Orokam, Ochekwu, Ai-Ono, Edumoga, Ejigbo, Ito, Agatu, and Apa. Each clan has its own way of speaking Idoma — you can tell an Agatu man from an Orokam man the moment either opens his mouth — and each has its own shrine, its own festival dates, its own founder story.",
    tags: ["clans", "ai", "otukpo", "adoka", "igumale", "orokam", "agatu"],
  },
  {
    id: "clan-agatu",
    title: "Agatu — our people by the river",
    category: "Clans",
    content:
      "The Agatu sit at the top edge of Ai wa, where the Benue river bends. They are our fishermen and rice farmers; their dialect drops sharper on the ear than ours further south. Their headquarters is Obagaji. When there is trouble on the river, it is Agatu voices we hear first.",
    tags: ["agatu", "obagaji", "river benue"],
  },

  // ---------- LGAs ----------
  {
    id: "lgas",
    title: "The nine local governments of Ai wa",
    category: "LGAs",
    content:
      "On paper, Ai wa is Otukpo, Ohimini, Okpokwu, Ogbadibo, Ado, Apa, Agatu, Obi, and parts of Oju. Otukpo is the head — where the palace sits and where all roads meet. The others each carry their own clan character; ask any of us where we're 'from' and we'll name our LGA before our state.",
    tags: ["lga", "otukpo", "ohimini", "okpokwu", "ogbadibo", "ado", "apa", "agatu", "obi"],
  },

  // ---------- Festivals ----------
  {
    id: "aje-alekwu",
    title: "Aje-Alekwu — the night the ancestors come",
    category: "Festivals",
    content:
      "Once a year, in the dry season, we call our dead home. The compound is swept, palm wine is set on the shrine, and by night the masquerades — Alekwu wearing cloth — enter the square. The drums drop low. Children go quiet. In the morning we eat from one pot: it is one of the few days the whole clan is truly one household.",
    tags: ["alekwu", "ancestors", "masquerade", "aje"],
  },
  {
    id: "eje-alago",
    title: "Eje-Alago — thanking the yam",
    category: "Festivals",
    content:
      "After the main harvest, we do not just celebrate — we thank. The young men wrestle (ije) for the honour of their village, the girls dance in red and black, and the head of every household carries the first heap of yams to the compound shrine before anyone eats.",
    tags: ["eje", "harvest", "wrestling", "ije"],
  },
  {
    id: "ito-ogwu",
    title: "Ito Ogwu — the new yam",
    category: "Festivals",
    content:
      "Yam (ogwu) is our prestige crop; no man calls himself a farmer if he does not grow yam. Ito Ogwu is the day the first new yam is eaten. The Ọch' of the clan tastes first, then the elders, then the households. Anyone who eats new yam before Ito Ogwu is done is said to be inviting hunger.",
    tags: ["ito ogwu", "new yam", "ogwu", "harvest"],
  },

  // ---------- Proverbs ----------
  {
    id: "proverb-elephant",
    title: "Owo ọ̀nyi ka owo ọ̀nyi — 'one hand and one hand'",
    category: "Proverbs",
    content:
      "'One hand and one hand make a load.' Ai wa uses this whenever cooperation is needed — carrying a yam heap, raising a child, settling a matter. No one carries alone.",
    tags: ["proverb", "unity"],
  },
  {
    id: "proverb-patience",
    title: "Owo ka i chogba — 'the hand that is not in a hurry'",
    category: "Proverbs",
    content:
      "'The hand that is not in a hurry will eat well.' A word our fathers give young men who want everything at once. Patience feeds; hurry drops the yam.",
    tags: ["proverb", "patience"],
  },

  // ---------- Greetings ----------
  {
    id: "greetings-basic",
    title: "How Ai wa greets",
    category: "Greetings",
    content:
      "Ije oyi — 'you have arrived well,' the closest thing we have to 'welcome home.' Abo — hello. Nom̀ — thank you. Ada nwu? — 'how are you?' We greet arrival before we greet anything else; to enter a compound without saying Ije oyi is to enter a stranger.",
    tags: ["greeting", "hello", "welcome", "thank you", "ije oyi", "abo"],
  },
  {
    id: "greetings-elders",
    title: "How we greet our elders",
    category: "Greetings",
    content:
      "To an older man we say Ada; to an older woman, Ene. A younger person bows slightly, uses both hands to receive anything from an elder, and never calls an elder by their first name alone. If you fail this in Ai wa, someone's mother will correct you before your own.",
    tags: ["elder", "ada", "ene", "respect"],
  },

  // ---------- Tourist Sites ----------
  {
    id: "otukpo-town",
    title: "Otukpo — where the roads end",
    category: "Tourist Sites",
    content:
      "Otukpo is the cultural head of Ai wa. The Ọch'Idoma's palace is here; Idoma Day is celebrated here; and when a son of Ai wa wants to marry, it is often at Otukpo the two families meet. It is our largest town and our meeting point.",
    tags: ["otukpo", "palace", "capital"],
  },
  {
    id: "ojira-hills",
    title: "Ojira Hills",
    category: "Tourist Sites",
    content:
      "Low green hills in Ohimini where our grandmothers still farm yam ridges. Old shrines sit among the rocks. Elders take newborns up at dawn to be 'shown' to Alekwu.",
    tags: ["ojira", "hills", "ohimini"],
  },
  {
    id: "ogbadibo-caves",
    title: "Ogbadibo Caves",
    category: "Tourist Sites",
    content:
      "Sandstone caves in Ogbadibo. Our fathers say Ai wa hid here during the wars from the north, and that some of our clan names were first spoken inside them.",
    tags: ["caves", "ogbadibo", "migration"],
  },

  // ---------- Cultural Practices ----------
  {
    id: "alekwu",
    title: "Alekwu — our ancestors, still present",
    category: "Cultural Practices",
    content:
      "Alekwu is not a god and not a ghost — Alekwu is our departed, gathered. They watch. They correct. They are called on at family shrines, at every serious matter, at every festival. When a masquerade dances in the square, that is Alekwu wearing cloth so we can see. To lie in front of Alekwu is to invite sickness on your own head.",
    tags: ["alekwu", "ancestors", "religion", "masquerade"],
  },
  {
    id: "marriage",
    title: "How we marry in Ai wa",
    category: "Cultural Practices",
    content:
      "Marriage is not two people; it is two families. First, ilo ọ́la — the introduction, where the young man's people come to knock. Then the elders sit and settle bride-price (never rushed; always with palm wine and kola). Then the wedding, with dancing in ápà and gifts flowing between the two households. If either family is unwilling, no marriage happens — no matter what the two young people want.",
    tags: ["marriage", "bride price", "wedding", "kola"],
  },
  {
    id: "foods",
    title: "What we eat",
    category: "Cultural Practices",
    content:
      "Okoho soup — the stretchy soup made from okoho bark, eaten with pounded yam (utaba). That is the taste of home. Oka (maize dough), egwusi soup, bushmeat stews when the hunt is good, and palm wine (oyi) tapped fresh from the tree. Yam is king; no serious meal is served without it. When our diaspora children come home, it is okoho and utaba they ask for at the door.",
    tags: ["food", "okoho", "pounded yam", "utaba", "oka", "palm wine"],
  },
  {
    id: "dress",
    title: "Ápà — our red and black cloth",
    category: "Cultural Practices",
    content:
      "Ápà is the woven red-and-black cloth every Idoma person knows on sight. Men wrap it around the waist and over one shoulder; women wear it as a full wrapper. Coral beads at the neck, cowries at the wrist. The wedding cut, the burial cut, and the everyday cut are not the same — our tailors will tell you off if you order the wrong one.",
    tags: ["dress", "cloth", "red and black", "apa", "beads"],
  },
  {
    id: "language",
    title: "Our language",
    category: "Cultural Practices",
    content:
      "Idoma is a tonal language — the same syllable can mean three different things depending on how you drop your voice. About 3 to 4 million of us speak it, across every clan of Ai wa. The Otukpo dialect is the one most people learn first, but Agatu, Adoka, Igumale, and Orokam each have their own tune. We say: if you cannot greet in Idoma, you cannot claim Idoma.",
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
