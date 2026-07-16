export type Place = {
  name: string;
  location: string;
  summary: string;
  significance: string;
};

export const PLACES: Place[] = [
  {
    name: "Otukpo",
    location: "Otukpo LGA, Benue State",
    summary:
      "The cultural heart of Idomaland and the largest urban center of the Idoma people.",
    significance:
      "Home to the palace of the Och'Idoma, the paramount ruler of the Idoma nation, and host to major cultural gatherings.",
  },
  {
    name: "Ojira Hills",
    location: "Ohimini, Benue State",
    summary: "Rolling savanna hills dotted with ancestral shrines and traditional farmsteads.",
    significance: "Considered a spiritual landscape in Idoma cosmology.",
  },
  {
    name: "Ogbadibo Caves",
    location: "Ogbadibo LGA",
    summary: "Ancient sandstone caves said to have sheltered ancestors during migrations.",
    significance: "Referenced in the oral history of several Idoma clans.",
  },
  {
    name: "River Okpokwu",
    location: "Okpokwu LGA",
    summary: "A river system used for fishing, farming, and traditional ceremonies.",
    significance: "Site of seasonal festivals honouring ancestral spirits (Alekwu).",
  },
  {
    name: "Ai-Ono Groves",
    location: "Ado LGA",
    summary: "Sacred forest groves preserved by community elders.",
    significance: "Repositories of medicinal plants and ritual knowledge.",
  },
  {
    name: "Palace of the Och'Idoma",
    location: "Otukpo",
    summary: "The traditional seat of the Idoma paramount ruler.",
    significance:
      "Center of Idoma traditional governance and coordinator of cultural affairs across clans.",
  },
];

export type Festival = {
  name: string;
  when: string;
  summary: string;
};

export const FESTIVALS: Festival[] = [
  {
    name: "Aje-Alekwu",
    when: "Annual, dry season",
    summary:
      "Ancestral veneration festival honouring Alekwu, the collective spirit of departed ancestors, with masquerades, drumming, and communal feasts.",
  },
  {
    name: "Eje-Alago",
    when: "Post-harvest",
    summary:
      "A thanksgiving festival celebrating a successful farming season, featuring wrestling contests and traditional dances.",
  },
  {
    name: "Ito Ogwu",
    when: "Varies by clan",
    summary:
      "New yam festival marking the start of the eating of new yams — a symbol of prosperity and continuity.",
  },
  {
    name: "Ekwuchi",
    when: "Seasonal",
    summary:
      "Youth coming-of-age celebration where age grades are initiated into new responsibilities.",
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
    description: "Comfortable rooms with a courtyard restaurant serving Idoma cuisine.",
  },
  {
    name: "Mama Ene's Kitchen",
    category: "Restaurants",
    location: "Otukpo Central Market",
    description: "Renowned for okoho soup, pounded yam, and grilled fish.",
  },
  {
    name: "Idoma Bead Cooperative",
    category: "Artisans",
    location: "Ugbokolo",
    description: "Traditional coral and glass bead craftwork by a women's cooperative.",
  },
  {
    name: "Ochekwu Tailors",
    category: "Tailors",
    location: "Otukpo",
    description: "Custom Idoma traditional attire, including the iconic red-and-black woven cloth.",
  },
  {
    name: "Benue Heritage Tours",
    category: "Tour Guides",
    location: "Otukpo",
    description: "Guided cultural tours of Idoma historical sites and festivals.",
  },
  {
    name: "Ai-Ono Herbal Center",
    category: "Wellness",
    location: "Ado",
    description: "Traditional herbal remedies from sacred grove medicinal plants.",
  },
];
