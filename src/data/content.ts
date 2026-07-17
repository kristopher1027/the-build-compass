export type Place = {
  name: string;
  location: string;
  summary: string;
  significance: string;
};

export const PLACES: Place[] = [
  {
    name: "Otukpo — Ai wa (our home)",
    location: "Otukpo LGA, Benue State",
    summary:
      "Otukpo is where we gather. Market days spill out onto the roads, Ọch'Idoma's palace stands at the town's heart, and on Idoma Day the streets carry the sound of every clan at once.",
    significance:
      "The seat of the Ọch'Idoma and the town our elders point to when they say 'go home.' Every clan has a road that ends here.",
  },
  {
    name: "Ojira Hills",
    location: "Ohimini, Benue State",
    summary:
      "Low green hills where our grandmothers still farm yam ridges and the harmattan wind carries the smell of burnt grass. Old shrines sit quietly among the rocks.",
    significance:
      "We say Alekwu walks these hills. Elders take newborns up at dawn to be 'shown' to the ancestors.",
  },
  {
    name: "Ogbadibo Caves",
    location: "Ogbadibo LGA",
    summary:
      "Sandstone caves cut deep into the escarpment. Our fathers say Ai wa hid here when the wars from the north came, and that some of our clan names were first spoken inside them.",
    significance:
      "A living record of the Apa migration. Several clans still trace their opening story to these walls.",
  },
  {
    name: "River Okpokwu",
    location: "Okpokwu LGA",
    summary:
      "The river the women of Okpokwu wash in at dawn and fish from with cane traps. Its banks are lined with silk-cotton trees older than our great-grandfathers.",
    significance:
      "Alekwu is honoured here at the turn of the dry season — palm wine poured into the water, kola broken on the bank.",
  },
  {
    name: "Ai-Ono sacred groves",
    location: "Ado LGA",
    summary:
      "A dark forest the elders of Ai-Ono have refused to let anyone cut. Inside, the paths are narrow and swept clean by the wind. Herbalists still walk in with a calabash to gather.",
    significance:
      "The pharmacy of Ai wa — the roots and barks our mothers boil when a child is fevered come from these groves.",
  },
  {
    name: "The palace of Ọch'Idoma",
    location: "Otukpo",
    summary:
      "A red-earth compound with cloth-lined receiving halls, drums at the entrance, and the Ọch'Idoma's stool at the far end. Chiefs from every clan come here to sit.",
    significance:
      "Where Ai wa speaks with one voice. Marriages between clans, land disputes, and cultural decisions still pass through this gate.",
  },
];

export type Festival = {
  name: string;
  when: string;
  summary: string;
};

export const FESTIVALS: Festival[] = [
  {
    name: "Aje-Alekwu — when the ancestors come home",
    when: "Dry season, once a year",
    summary:
      "The night the compound is swept clean, palm wine is set out, and the masquerades come. When Alekwu enters the square, the drums drop low, the children go quiet, and our fathers say the departed are among us again. In the morning we eat together — it is one of the few times the whole clan eats from one pot.",
  },
  {
    name: "Eje-Alago — thanking the yam",
    when: "After the main harvest",
    summary:
      "We do not just celebrate a good harvest — we thank it. The young men wrestle (ije) for the honour of their village, the girls dance in red and black, and the head of every household carries the first heap of yams to the compound shrine before anyone eats.",
  },
  {
    name: "Ito Ogwu — the new yam",
    when: "Varies by clan, usually mid-year",
    summary:
      "In Ai wa, no one eats a single new yam before Ito Ogwu is done. The Ọch' of the clan tastes first, then the elders, then the households. To break this order is to invite hunger the following year.",
  },
  {
    name: "Ekwuchi — the age-grade rite",
    when: "Every few years",
    summary:
      "The season our young men and women 'cross' — they are handed the responsibilities of adults: farming, marriage, community work. Their age-grade name will follow them for the rest of their life.",
  },
];

export type Business = {
  name: string;
  category: string;
  location: string;
  description: string;
};

export const BUSINESSES: Business[] = [
  {
    name: "Alekwu Guesthouse",
    category: "Hotels",
    location: "Otukpo",
    description:
      "A small family-run place off the Otukpo–Enugu road. Rooms are simple, the courtyard is quiet, and the cook will make okoho soup even if it's not on the menu — just ask.",
  },
  {
    name: "Mama Ene's kitchen",
    category: "Restaurants",
    location: "Otukpo central market",
    description:
      "Mama Ene has been pounding yam here since our secondary school days. Okoho soup with goat meat, catfish pepper soup, and cold zobo — the kind of food that reminds our diaspora children why they came home.",
  },
  {
    name: "Idoma bead cooperative",
    category: "Artisans",
    location: "Ugbokolo",
    description:
      "The women of Ugbokolo string coral, cowrie, and glass beads the way their mothers taught them — for chieftaincy dress, weddings, and naming ceremonies. They will match your ápà cloth if you bring a sample.",
  },
  {
    name: "Ochekwu tailors",
    category: "Tailors",
    location: "Otukpo",
    description:
      "Ápà — our red-and-black woven cloth — sewn to fit. They know the difference between the wedding cut, the burial cut, and the everyday cut, and they will not let you leave with the wrong one.",
  },
  {
    name: "Benue heritage tours",
    category: "Tour guides",
    location: "Otukpo",
    description:
      "Run by two brothers from Ohimini who grew up walking these hills. They'll take you to the caves, the groves, and — if you're respectful — introduce you to an elder who still remembers the old songs.",
  },
  {
    name: "Ai-Ono herbal centre",
    category: "Wellness",
    location: "Ado",
    description:
      "The barks and roots the herbalists gather from the sacred groves — prepared for stomach, fever, and postnatal care. Ask before you photograph anything; some plants are still Alekwu's.",
  },
];
